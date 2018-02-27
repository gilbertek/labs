const graphql = require('graphql');

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLScalarType,
  GraphQLUnionType,
  GraphQLEnumType,
  GraphQLSchema,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLNonNull,
  buildSchema,
} = graphql;

const { Kind } = require('graphql/language');
const Data = require('./data');

function deserializeDate(value) {
  const result = value.match(/^(\d+)\W?(BBY|ABY)$/);

  if (result) {
    return (result[2] === 'BBY' ? -1 : 1) * parseInt(result[1], 10);
  }

  return null;
}

function serializeDate(value) {
  return `${Math.abs(value)} ${Math.sign(value) === 1 ? 'ABY' : 'BBY'}`;
}

const DateType = new GraphQLScalarType({
  name: 'Date',
  description: 'Date in relation to battle of Yavin',
  serialize: serializeDate,
  parseValue: deserializeDate,
  parseLiteral: (ast) => {
    if (ast.kind === Kind.STRING) {
      return deserializeDate(ast.value);
    }

    return null;
  },
});

const EpisodeEnum = new GraphQLEnumType({
  name: 'Episode',
  description: 'One of the Star Wars films',
  values: {
    TPM: {
      value: 1,
      description: 'First movie of the prequels. Released 1999.',
    },
    AOTC: {
      value: 2,
      description: 'Second movie of the prequels. Released 2002.',
    },
    ROTS: {
      value: 3,
      description: 'Third movie of the prequels. Released 2005.',
    },
    ANH: {
      value: 4,
      description: 'First movie of the original trilogy. Released 1977.',
    },
    ESB: {
      value: 5,
      description: 'Second movie of the original trilogy. Released 1980.',
    },
    ROTJ: {
      value: 6,
      description: 'Third movie of the original trilogy. Released 1983.',
    },
    TFA: {
      value: 7,
      description: 'First movie of the sequels. Released 2015.',
    },
    TLJ: {
      value: 8,
      description: 'Second movie of the sequels. Released 2017.',
    },
  },
});

const CharacterInterface = new GraphQLInterfaceType({
  name: 'Character',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    appearsIn: { type: new GraphQLList(EpisodeEnum) },
    friends: {
      type: new GraphQLList(CharacterInterface),
      args: { appearsIn: { type: EpisodeEnum } },
    },
  }),

  resolveType: (value) => {
    switch (value.type) {
      case 'Human': return HumanType;
      case 'Droid': return DroidType;
      default: return null;
    }
  },
});

const HumanType = new GraphQLObjectType({
  name: 'HumanType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    birthYear: { type: DateType },
  }),
});


const DroidType = new GraphQLObjectType({
  name: 'DroidType',
  description: 'A droid character in the Start Wars universe.',
  interfaces: [CharacterInterface],
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    manufacturer: { type: GraphQLString },
    appearsIn: { type: new GraphQLList(EpisodeEnum) },
    friends: {
      type: new GraphQLList(CharacterInterface),
      args: { appearsIn: { type: EpisodeEnum } },
      resolve: (droid, { appearsIn }) => Data.getFriends(droid, appearsIn),
    },
  }),
});

const query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    character: {
      type: CharacterInterface,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
          description: 'ID of the character',
        },
      },
      resolve: (root, { id }) => Data.getCharacter(id),
    },
  }),
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createHuman: {
      description: 'Create a new human character',
      type: HumanType,
      args: {
        human: { type: HumanType },
      },
      resolve: (root, { human }) => Data.createHuman(human),
    },
  }),
});

module.exports = new GraphQLSchema({
  query,
  types: [HumanType, DroidType],
  mutation,
});
