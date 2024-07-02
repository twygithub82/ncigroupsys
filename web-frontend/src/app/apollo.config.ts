import { NgModule } from '@angular/core';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({ uri: 'https://tlx-idms-gateway.azurewebsites.net/graphql/' })
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
export class GraphQLModule {}