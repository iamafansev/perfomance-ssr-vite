/* eslint-disable */
// WARNING: This file was automatically generated by graphql-code-generator and should not be edited.
import * as Types from '../types/graphql';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type PokemonsQueryVariables = Types.Exact<{ [key: string]: never }>;

export type PokemonsQuery = {
  __typename?: 'Query';
  pokemons?: Array<{
    __typename?: 'Pokemon';
    id: string;
    name: string;
  } | null> | null;
};

export const PokemonsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Pokemons' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'pokemons' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: { kind: 'IntValue', value: '10' },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<PokemonsQuery, PokemonsQueryVariables>;
