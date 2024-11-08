# Cloud Resources Web Application

This is a small web application that displays a list of cloud resources, implements real-time updates, search, and filtering functionality. Data is fetched via GraphQL to provide efficient querying and subscription support for real-time updates.

## Features

- [List Cloud Resources](#list-cloud-resources): Displays a list of cloud resources with essential details.
- [Real-Time Updates](#real-time-updates): Automatically updates the resource list when there are changes.
- [Filtering and Search](#filtering-and-search): Provides options to filter by resource type, status, and a search bar to filter by name.
- [GraphQL API](#graphql-api): Uses GraphQL to handle data fetching and subscriptions for real-time updates.

## Tech Stack

- **Frontend**: Next.js, Apollo Client
- **Backend**: Apollo Server, Express.js, GraphQL, WebSocket
- **WebSocket Library**: `graphql-ws` for handling subscriptions

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v14 or later)
- **npm** or **yarn**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/cloud-resources-app.git
   cd cloud-resources-app
   ```
2. **Install dependencies**:

   ```bash
    # In the server directory
    npm install
    # In the client directory
    cd client
    npm install
   ```

3. Run the server: In the root of the server directory, start the backend server:

   ```bash
    npm run dev
   ```

   The server should be running at http://localhost:4000.

4. Run the client: In the client directory, start the Next.js frontend:

   ```bash
   npm run dev
   ```

   The client should be running at http://localhost:3000

## Usage

- **View Cloud Resources**: On the main page, you can view all available cloud resources.
- **Search and Filter**: Use the search bar to filter resources by name, or use the dropdown menus to filter by type and status.
- **Real-Time Updates**: Resources update in real-time when there are changes on the server.

## Project Structure

- **server**: Contains the backend server setup with Apollo Server, GraphQL schema, and WebSocket integration.
- **client**: Contains the Next.js frontend with components for displaying, searching, and filtering cloud resources.

## Example GraphQL Queries

1. **Fetch All Cloud Resources**:

   ```graphql
   query {
     cloudResources {
       id
       name
       type
       status
     }
   }
   ```

2. **Subscription for Resource Updates**:

   ```graphql
   subscription {
     resourceUpdated {
       id
       name
       type
       status
     }
   }
   ```

## Deployment

For deployment, you can use platforms such as Vercel for the frontend and Heroku or Render for the backend. Ensure WebSocket support is configured on the server for subscriptions.

## Contributing

1. Fork the repository.
2. Create a feature branch: git checkout -b feature-name
3. Commit changes: git commit -m 'Add some feature'
4. Push to the branch: git push origin feature-name
5. Create a pull request.

## License

This project is licensed under the [MIT License](LICENSE). See the LICENSE file for details.
