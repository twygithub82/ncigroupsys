import { NgModule } from '@angular/core';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, split, type ApolloClientOptions } from '@apollo/client/core';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { Kind, OperationTypeNode } from 'graphql';
import { environment } from 'environments/environment';

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        const http = httpLink.create({ uri: environment.graphQLUrl });
        // const http = httpLink.create({ uri: 'http://localhost:5225/graphql/'});
        // Create a WebSocket link:
        const ws = new GraphQLWsLink(
          createClient({
            url: environment.graphqlWsUrl,
          }),
        );
        return {
          cache: new InMemoryCache(),
          //link: httpLink.create({ uri: 'https://tlx-idms-gateway.azurewebsites.net/graphql/' })
          link: split( // Split based on operation type
            ({ query }) => {
              const definition = getMainDefinition(query);
              return (
                definition.kind === Kind.OPERATION_DEFINITION &&
                definition.operation === OperationTypeNode.SUBSCRIPTION
              );
            },
            ws,
            http,)
          //link: httpLink.create({ uri: 'http://207.46.137.171/graphql/' }),
          //link: httpLink.create({ uri: 'https://tlx-idms-app.azurewebsites.net/graphql/' }),
          //link: httpLink.create({ uri: 'https://tlx-idms-parameter-v1.azurewebsites.net/graphql/' }),
          //link: httpLink.create({ uri: 'https://tlx-idms-tariff-cleaning.azurewebsites.net/graphql/' }),
          //link: httpLink.create({ uri: 'https://tlx-idms-inventory-ingate.azurewebsites.net/graphql/' }),
        };
      },
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule { }