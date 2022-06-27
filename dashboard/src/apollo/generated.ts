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
  LogLevel: "info" | "warning" | "error";
};

export type Guild = {
  __typename?: 'Guild';
  currentlyPlaying: Song;
  icon: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
  playbackStatus: PlaybackStatus;
  queue: Array<Song>;
};

export type Log = {
  __typename?: 'Log';
  id: Scalars['Int'];
  level: Scalars['LogLevel'];
  message: Scalars['String'];
  timestamp: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  pause: Scalars['Boolean'];
  registerCommands: Scalars['Boolean'];
  resume: Scalars['Boolean'];
  skip: Scalars['Boolean'];
};


export type MutationPauseArgs = {
  guildId: Scalars['String'];
};


export type MutationResumeArgs = {
  guildId: Scalars['String'];
};


export type MutationSkipArgs = {
  guildId: Scalars['String'];
};

export type PlaybackStatus = {
  __typename?: 'PlaybackStatus';
  isPlaying: Scalars['Boolean'];
};

export type Query = {
  __typename?: 'Query';
  guild: Guild;
  guilds: Array<Guild>;
  logs: Array<Log>;
};


export type QueryGuildArgs = {
  guildId: Scalars['String'];
};


export type QueryLogsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
};

export type Song = {
  __typename?: 'Song';
  duration: Scalars['Int'];
  thumbnail: Scalars['String'];
  title: Scalars['String'];
  url: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  guildUpdated: Guild;
};


export type SubscriptionGuildUpdatedArgs = {
  guildId: Scalars['String'];
};

export type GuildsQueryVariables = Exact<{ [key: string]: never; }>;


export type GuildsQuery = { __typename?: 'Query', guilds: Array<{ __typename?: 'Guild', id: string, name: string, icon: string }> };

export type GuildQueryVariables = Exact<{
  guildId: Scalars['String'];
}>;


export type GuildQuery = { __typename?: 'Query', guild: { __typename?: 'Guild', id: string, currentlyPlaying: { __typename?: 'Song', title: string, url: string, thumbnail: string, duration: number }, playbackStatus: { __typename?: 'PlaybackStatus', isPlaying: boolean }, queue: Array<{ __typename?: 'Song', title: string, url: string, thumbnail: string, duration: number }> } };

export type LogsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
}>;


export type LogsQuery = { __typename?: 'Query', logs: Array<{ __typename?: 'Log', id: number, timestamp: string, level: "info" | "warning" | "error", message: string }> };

export type RegisterCommandsMutationVariables = Exact<{ [key: string]: never; }>;


export type RegisterCommandsMutation = { __typename?: 'Mutation', registerCommands: boolean };

export type ResumeMutationVariables = Exact<{
  guildId: Scalars['String'];
}>;


export type ResumeMutation = { __typename?: 'Mutation', resume: boolean };

export type PauseMutationVariables = Exact<{
  guildId: Scalars['String'];
}>;


export type PauseMutation = { __typename?: 'Mutation', pause: boolean };

export type SkipMutationVariables = Exact<{
  guildId: Scalars['String'];
}>;


export type SkipMutation = { __typename?: 'Mutation', skip: boolean };

export type GuildUpdatedSubscriptionVariables = Exact<{
  guildId: Scalars['String'];
}>;


export type GuildUpdatedSubscription = { __typename?: 'Subscription', guildUpdated: { __typename?: 'Guild', id: string, currentlyPlaying: { __typename?: 'Song', title: string, url: string, thumbnail: string, duration: number }, playbackStatus: { __typename?: 'PlaybackStatus', isPlaying: boolean }, queue: Array<{ __typename?: 'Song', title: string, url: string, thumbnail: string, duration: number }> } };


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
    playbackStatus {
      isPlaying
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
export const LogsDocument = gql`
    query logs($limit: Int) {
  logs(limit: $limit) {
    id
    timestamp
    level
    message
  }
}
    `;

/**
 * __useLogsQuery__
 *
 * To run a query within a React component, call `useLogsQuery` and pass it any options that fit your needs.
 * When your component renders, `useLogsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLogsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useLogsQuery(baseOptions?: Apollo.QueryHookOptions<LogsQuery, LogsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LogsQuery, LogsQueryVariables>(LogsDocument, options);
      }
export function useLogsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LogsQuery, LogsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LogsQuery, LogsQueryVariables>(LogsDocument, options);
        }
export type LogsQueryHookResult = ReturnType<typeof useLogsQuery>;
export type LogsLazyQueryHookResult = ReturnType<typeof useLogsLazyQuery>;
export type LogsQueryResult = Apollo.QueryResult<LogsQuery, LogsQueryVariables>;
export const RegisterCommandsDocument = gql`
    mutation registerCommands {
  registerCommands
}
    `;
export type RegisterCommandsMutationFn = Apollo.MutationFunction<RegisterCommandsMutation, RegisterCommandsMutationVariables>;

/**
 * __useRegisterCommandsMutation__
 *
 * To run a mutation, you first call `useRegisterCommandsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterCommandsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerCommandsMutation, { data, loading, error }] = useRegisterCommandsMutation({
 *   variables: {
 *   },
 * });
 */
export function useRegisterCommandsMutation(baseOptions?: Apollo.MutationHookOptions<RegisterCommandsMutation, RegisterCommandsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterCommandsMutation, RegisterCommandsMutationVariables>(RegisterCommandsDocument, options);
      }
export type RegisterCommandsMutationHookResult = ReturnType<typeof useRegisterCommandsMutation>;
export type RegisterCommandsMutationResult = Apollo.MutationResult<RegisterCommandsMutation>;
export type RegisterCommandsMutationOptions = Apollo.BaseMutationOptions<RegisterCommandsMutation, RegisterCommandsMutationVariables>;
export const ResumeDocument = gql`
    mutation resume($guildId: String!) {
  resume(guildId: $guildId)
}
    `;
export type ResumeMutationFn = Apollo.MutationFunction<ResumeMutation, ResumeMutationVariables>;

/**
 * __useResumeMutation__
 *
 * To run a mutation, you first call `useResumeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResumeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resumeMutation, { data, loading, error }] = useResumeMutation({
 *   variables: {
 *      guildId: // value for 'guildId'
 *   },
 * });
 */
export function useResumeMutation(baseOptions?: Apollo.MutationHookOptions<ResumeMutation, ResumeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResumeMutation, ResumeMutationVariables>(ResumeDocument, options);
      }
export type ResumeMutationHookResult = ReturnType<typeof useResumeMutation>;
export type ResumeMutationResult = Apollo.MutationResult<ResumeMutation>;
export type ResumeMutationOptions = Apollo.BaseMutationOptions<ResumeMutation, ResumeMutationVariables>;
export const PauseDocument = gql`
    mutation pause($guildId: String!) {
  pause(guildId: $guildId)
}
    `;
export type PauseMutationFn = Apollo.MutationFunction<PauseMutation, PauseMutationVariables>;

/**
 * __usePauseMutation__
 *
 * To run a mutation, you first call `usePauseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePauseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pauseMutation, { data, loading, error }] = usePauseMutation({
 *   variables: {
 *      guildId: // value for 'guildId'
 *   },
 * });
 */
export function usePauseMutation(baseOptions?: Apollo.MutationHookOptions<PauseMutation, PauseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PauseMutation, PauseMutationVariables>(PauseDocument, options);
      }
export type PauseMutationHookResult = ReturnType<typeof usePauseMutation>;
export type PauseMutationResult = Apollo.MutationResult<PauseMutation>;
export type PauseMutationOptions = Apollo.BaseMutationOptions<PauseMutation, PauseMutationVariables>;
export const SkipDocument = gql`
    mutation skip($guildId: String!) {
  skip(guildId: $guildId)
}
    `;
export type SkipMutationFn = Apollo.MutationFunction<SkipMutation, SkipMutationVariables>;

/**
 * __useSkipMutation__
 *
 * To run a mutation, you first call `useSkipMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSkipMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [skipMutation, { data, loading, error }] = useSkipMutation({
 *   variables: {
 *      guildId: // value for 'guildId'
 *   },
 * });
 */
export function useSkipMutation(baseOptions?: Apollo.MutationHookOptions<SkipMutation, SkipMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SkipMutation, SkipMutationVariables>(SkipDocument, options);
      }
export type SkipMutationHookResult = ReturnType<typeof useSkipMutation>;
export type SkipMutationResult = Apollo.MutationResult<SkipMutation>;
export type SkipMutationOptions = Apollo.BaseMutationOptions<SkipMutation, SkipMutationVariables>;
export const GuildUpdatedDocument = gql`
    subscription guildUpdated($guildId: String!) {
  guildUpdated(guildId: $guildId) {
    id
    currentlyPlaying {
      title
      url
      thumbnail
      duration
    }
    playbackStatus {
      isPlaying
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
 * __useGuildUpdatedSubscription__
 *
 * To run a query within a React component, call `useGuildUpdatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useGuildUpdatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGuildUpdatedSubscription({
 *   variables: {
 *      guildId: // value for 'guildId'
 *   },
 * });
 */
export function useGuildUpdatedSubscription(baseOptions: Apollo.SubscriptionHookOptions<GuildUpdatedSubscription, GuildUpdatedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<GuildUpdatedSubscription, GuildUpdatedSubscriptionVariables>(GuildUpdatedDocument, options);
      }
export type GuildUpdatedSubscriptionHookResult = ReturnType<typeof useGuildUpdatedSubscription>;
export type GuildUpdatedSubscriptionResult = Apollo.SubscriptionResult<GuildUpdatedSubscription>;