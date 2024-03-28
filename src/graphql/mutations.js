/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createItem = /* GraphQL */ `
  mutation CreateItem($name: String!, $price: String!, $category: String!) {
    createItem(name: $name, price: $price, category: $category) {
      id
      name
      price
      category
      __typename
    }
  }
`;
export const updateItem = /* GraphQL */ `
  mutation UpdateItem(
    $id: ID!
    $name: String!
    $price: String!
    $category: String!
  ) {
    updateItem(id: $id, name: $name, price: $price, category: $category) {
      id
      name
      price
      category
      __typename
    }
  }
`;
export const deleteItem = /* GraphQL */ `
  mutation DeleteItem($id: ID!) {
    deleteItem(id: $id) {
      id
      name
      price
      category
      __typename
    }
  }
`;
