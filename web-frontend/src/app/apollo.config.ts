import { NgModule } from '@angular/core';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, split, type ApolloClientOptions } from '@apollo/client/core';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { Kind, OperationTypeNode } from 'graphql';
import { environment } from 'environments/environment';
import { setContext } from '@apollo/client/link/context';

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        // HTTP Link
        const http = httpLink.create({ uri: environment.graphQLUrl });

        // Create a WebSocket link:
        const ws = new GraphQLWsLink(
          createClient({
            url: environment.graphqlWsUrl,
          }),
        );

        // Split Link: Direct subscriptions to WebSocket, others to HTTP
        const link = split(
          ({ query }) => {
            const definition = getMainDefinition(query);
            return (
              definition.kind === Kind.OPERATION_DEFINITION &&
              definition.operation === OperationTypeNode.SUBSCRIPTION
            );
          },
          ws,
          http
        );
        
        return {
          cache: new InMemoryCache(),
          link,
        };
      },
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule { }