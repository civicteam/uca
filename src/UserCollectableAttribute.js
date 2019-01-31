const _ = require('lodash');
const timestamp = require('unix-timestamp');
const uuidv4 = require('uuid/v4');
const definitions = require('./definitions');
const {
  resolveType, isValueOfType, getTypeName, getTypeDefinition, getObjectBasePropName, getObjectTypeDefProps,
} = require('./utils');

const isAttestableValue = value => (value && value.attestableValue);

/**
 * Creates new UCA instances
 * @param {*} identifier
 * @param {*} value
 */
class UserCollectableAttribute {
  constructor(identifier, value, version, customDefinitions) {
    this.id = null;
    this.identifier = null;
    this.timestamp = null;
    this.version = null;
    this.type = null;
    this.value = null;
    this.credentialItem = null;
    this.definitions = customDefinitions || definitions;

    this.initialize(identifier, value, version);
  }

  initialize(identifier, value, version) {
    const definition = version
      ? _.find(this.definitions, { identifier, version }) : _.find(this.definitions, { identifier });

    if (!definition) {
      return this.handleNotFoundDefinition(identifier, version);
    }

    this.timestamp = null;
    this.id = null;
    this.identifier = identifier;
    this.version = version || definition.version;
    this.type = getTypeName(definition, this.definitions);

    definition.type = resolveType(definition, this.definitions);
    if (isAttestableValue(value)) {
      this.value = value;
      this.initializeAttestableValue();
    } else if (isValueOfType(value, this.type)) {
      // Trying to construct UCA with a normal value
      this.timestamp = timestamp.now();
      if (!UserCollectableAttribute.isValid(value, this.type, definition)) {
        throw new Error(`${JSON.stringify(value)} is not valid for ${identifier}`);
      }
      this.value = value;
    } else if (_.isEmpty(definition.type.properties)) {
      throw new Error(`${JSON.stringify(value)} is not valid for ${identifier}`);
    } else {
      const hasRequireds = _.reduce(definition.type.required, (has, required) => value[required] && has, true);
      if (!hasRequireds) {
        throw new Error(`Missing required fields to ${identifier}`);
      }
      const ucaValue = _.mapValues(_.keyBy(_.map(value, (v, k) => {
        const propertyDef = _.find(definition.type.properties, { name: k });
        const uca = new this.constructor(propertyDef.type, v, propertyDef.version);
        return { key: k, value: uca };
      }), 'key'), 'value');
      this.value = ucaValue;
    }

    this.credentialItem = definition.credentialItem;
    this.id = `${this.version}:${this.identifier}:${uuidv4()}`;
    return this;
  }

  handleNotFoundDefinition(identifier, version) {
    if (version != null) {
      const definition = _.find(this.definitions, { identifier });
      if (definition) {
        throw new Error(`Version ${version} is not supported for the identifier ${identifier}`);
      }
    }

    throw new Error(`${identifier} is not defined`);
  }

  initializeAttestableValue() {
    throw new Error(`UserCollectableAttribute must not receive attestable value: ${JSON.stringify(this.value)}`);
  }

  getPlainValue(propName) {
    const newParent = {};
    const result = [];
    switch (this.type) {
      case 'String':
      case 'Number':
      case 'Boolean':
        if (propName) {
          newParent[propName] = this.value;
        } else {
          return this.value;
        }
        return newParent;
      default:
        _.forEach(_.sortBy(_.keys(this.value)), (k) => {
          result.push(this.value[k].getPlainValue(k));
        });
        _.forEach(result, (properties) => {
          if (propName) {
            newParent[propName] = newParent[propName] ? newParent[propName] : {};
            _.assign(newParent[propName], properties);
          } else {
            _.assign(newParent, properties);
          }
        });
        return newParent;
    }
  }

  static getAllProperties(identifier, pathName) {
    const definition = _.find(definitions, { identifier });
    const properties = [];
    const typeDefinition = getTypeDefinition(definitions, identifier);

    if (typeDefinition && getTypeName(typeDefinition, definitions) === 'Object') {
      const typeDefProps = getObjectTypeDefProps(definitions, typeDefinition);
      const basePropName = getObjectBasePropName(definitions, typeDefinition, pathName);

      if (_.includes(['String', 'Number', 'Boolean'], `${typeDefProps.type}`)) {
        // Properties is not an object
        properties.push(`${basePropName}.${typeDefProps.name}`);
      } else {
        _.forEach(typeDefProps, (prop) => {
          const typeSuffix = _.split(prop.type, ':')[2];
          const newBasePropName = prop.name === typeSuffix ? basePropName : `${basePropName}.${prop.name}`;
          const proProperties = UserCollectableAttribute.getAllProperties(prop.type, newBasePropName);
          _.forEach(proProperties, p => properties.push(p));
        });
      }
    } else if (pathName) {
      const propertiesName = `${pathName}.${_.split(definition.identifier, ':')[2]}`;
      properties.push(propertiesName);
    } else {
      const identifierComponents = _.split(identifier, ':');
      const propertiesName = `${_.lowerCase(identifierComponents[1])}.${identifierComponents[2]}`;
      properties.push(propertiesName);
    }
    return properties;
  }

  static getTemplateFor(identifier, version) {
    const t = { identifier, version };
    return t;
  }

  static isValid(value, type, definition) {
    switch (type) {
      case 'String':
        return (definition.pattern ? definition.pattern.test(value) : true)
          && (definition.minimumLength ? value.length >= definition.minimumLength : true)
          && (definition.maximumLength ? value.length <= definition.minimumLength : true);
      case 'Number':
        return ((!_.isNil(definition.minimum)
          && definition.exclusiveMinimum ? value > definition.minimum : value >= definition.minimum)
          || _.isNil(definition.minimum))
          && ((!_.isNil(definition.maximum)
            && definition.exclusiveMaximum ? value < definition.maximum : value <= definition.maximum)
            || _.isNil(definition.maximum));
      case 'Boolean':
        return _.isBoolean(value);
      default:
        return false;
    }
  }
}

function convertIdentifierToClassName(identifier) {
  const identifierComponents = _.split(identifier, ':');
  const baseName = identifierComponents[1];
  const detailName = _.upperFirst(_.camelCase(identifierComponents[2]));
  return `${baseName}${detailName}`;
}

function mixinIdentifiers(UCA) {
  // Extend UCA Semantic
  _.forEach(_.filter(definitions, d => d.credentialItem), (def) => {
    const name = convertIdentifierToClassName(def.identifier);
    const source = {};
    const { identifier } = def;

    function UCAConstructor(value, version) {
      const self = new UserCollectableAttribute(identifier, value, version);
      return self;
    }

    source[name] = UCAConstructor;
    _.mixin(UserCollectableAttribute, source);
  });
  return UCA;
}

const UserCollectableAttributeToExport = mixinIdentifiers(UserCollectableAttribute);
UserCollectableAttributeToExport.resolveType = resolveType;

module.exports = UserCollectableAttributeToExport;
