import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Guild = {
  __typename?: 'Guild';
  currentlyPlaying: Song;
  icon: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
  queue: Array<Song>;
};

export type Query = {
  __typename?: 'Query';
  guild: Guild;
  guilds: Array<Guild>;
};


export type QueryGuildArgs = {
  guildId: Scalars['String'];
};

export type Song = {
  __typename?: 'Song';
  duration: Scalars['Int'];
  thumbnail: Scalars['String'];
  title: Scalars['String'];
  url: Scalars['String'];
};

export type GuildsQueryVariables = Exact<{ [key: string]: never; }>;


export type GuildsQuery = { __typename?: 'Query', guilds: Array<{ __typename?: 'Guild', id: string, name: string, icon: string }> };

export type GuildQueryVariables = Exact<{
  guildId: Scalars['String'];
}>;


export type GuildQuery = { __typename?: 'Query', guild: { __typename?: 'Guild', id: string, currentlyPlaying: { __typename?: 'Song', title: string, url: string, thumbnail: string, duration: number }, queue: Array<{ __typename?: 'Song', title: string, url: string, thumbnail: string, duration: number }> } };


export const GuildsDocument = gql`
    query guilds {
  guilds {
    id
    name
    icon
  }
}
    `;

/**
 * __useGuildsQuery__
 *
 * To run a query within a React component, call `useGuildsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGuildsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGuildsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGuildsQuery(baseOptions?: Apollo.QueryHookOptions<GuildsQuery, GuildsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GuildsQuery, GuildsQueryVariables>(GuildsDocument, options);
      }
export function useGuildsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GuildsQuery, GuildsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GuildsQuery, GuildsQueryVariables>(GuildsDocument, options);
        }
export type GuildsQueryHookResult = ReturnType<typeof useGuildsQuery>;
export type GuildsLazyQueryHookResult = ReturnType<typeof useGuildsLazyQuery>;
export type GuildsQueryResult = Apollo.QueryResult<GuildsQuery, GuildsQueryVariables>;
export const GuildDocument = gql`
    query guild($guildId: String!) {
  guild(guildId: $guildId) {
    id
    currentlyPlaying {
      title
      url
      thumbnail
      duration
    }
    queue {
      title
      url
      thumbnail
      duration
    }
  }
}
    `;

/**
 * __useGuildQuery__
 *
 * To run a query within a React component, call `useGuildQuery` and pass it any options that fit your needs.
 * When your component renders, `useGuildQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGuildQuery({
 *   variables: {
 *      guildId: // value for 'guildId'
 *   },
 * });
 */
export function useGuildQuery(baseOptions: Apollo.QueryHookOptions<GuildQuery, GuildQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GuildQuery, GuildQueryVariables>(GuildDocument, options);
      }
export function useGuildLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GuildQuery, GuildQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GuildQuery, GuildQueryVariables>(GuildDocument, options);
        }
export type GuildQueryHookResult = ReturnType<typeof useGuildQuery>;
export type GuildLazyQueryHookResult = ReturnType<typeof useGuildLazyQuery>;
export type GuildQueryResult = Apollo.QueryResult<GuildQuery, GuildQueryVariables>;