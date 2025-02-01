import { NgModule } from '@angular/core';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, split, ApolloLink, type ApolloClientOptions, FetchResult } from '@apollo/client/core';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { Kind, OperationTypeNode } from 'graphql';
import { environment } from 'environments/environment';
import { setContext } from '@apollo/client/link/context';
import { AuthService } from '@core/service/auth.service';
import { onError } from '@apollo/client/link/error';
import { Observable as RxJSObservable, from, switchMap, catchError, of } from 'rxjs';
import { Observable as ZenObservable } from 'zen-observable-ts';
import { GraphQLError } from 'graphql';

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink, authService: AuthService): ApolloClientOptions<any> => {
        // 🔹 Attach JWT Token to Requests
        const authLink = setContext(() => {
          const token = authService.getAccessToken();
          return {
            headers: {
              Authorization: token ? `Bearer ${token}` : '',
            },
          };
        });

        // 🔹 Error Handling for 401 (UNAUTHENTICATED)
        const errorLink = onError(({ graphQLErrors, operation, forward }): ZenObservable<FetchResult> | void => {
          if (graphQLErrors) {
            for (const err of graphQLErrors) {
              const errObj: any = err;
              if (errObj?.extensions?.remote?.message?.toLowerCase().includes('unauthorized')) {
                console.warn('GraphQL 401 Unauthorized - Refreshing Token');

                return new ZenObservable<FetchResult>((observer) => {
                  from(authService.refreshToken())
                    .pipe(
                      switchMap((newToken): RxJSObservable<FetchResult> => {
                        // Retry the failed request with the new token
                        operation.setContext(({ headers = {} }) => ({
                          headers: {
                            ...headers,
                            Authorization: `Bearer ${newToken.token}`,
                          },
                        }));

                        return from(forward(operation)) as RxJSObservable<FetchResult>;
                      }),
                      catchError((): RxJSObservable<FetchResult> => {
                        console.error('Refresh token failed - Logging out user');
                        authService.logout();
                        return of({
                          errors: [new GraphQLError('Unauthorized')],
                          data: null,
                        });
                      })
                    )
                    .subscribe({
                      next: (result) => observer.next(result),
                      error: (err) => observer.error(err),
                      complete: () => observer.complete(),
                    });
                });
              }
            }
          }
          return; // Explicitly return void if no action is needed
        });

        // 🔹 HTTP Link (Queries & Mutations)
        const http = httpLink.create({ uri: environment.graphQLUrl });

        // 🔹 WebSocket Link (Subscriptions) with Authentication
        const ws = new GraphQLWsLink(
          createClient({
            url: environment.graphqlWsUrl,
            connectionParams: () => ({
              headers: {
                Authorization: `Bearer ${authService.getAccessToken() || ''}`,
              },
            }),
          })
        );

        // 🔹 Combine Authentication, Error Handling & HTTP Requests
        const httpWithAuth = ApolloLink.from([authLink, errorLink, http]);

        // 🔹 Split Queries/Mutations (HTTP) and Subscriptions (WebSockets)
        const link = split(
          ({ query }) => {
            const definition = getMainDefinition(query);
            return (
              definition.kind === Kind.OPERATION_DEFINITION &&
              definition.operation === OperationTypeNode.SUBSCRIPTION
            );
          },
          ws, // WebSocket for subscriptions
          httpWithAuth // HTTP with authentication & retry logic
        );

        return {
          cache: new InMemoryCache(),
          link,
        };
      },
      deps: [HttpLink, AuthService],
    },
  ],
})
export class GraphQLModule { }
