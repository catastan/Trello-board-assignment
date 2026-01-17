# Simplified Trello Clone

## Live Application

https://trello-board-assignment2-3gjl114w0-catas-projects-82742069.vercel.app

## Implementation Overview

The application is implemented as a full-stack Next.js project using the App Router.  
Frontend and backend logic are integrated in a single codebase, with server actions handling all database mutations.

## Data Persistence

MongoDB Atlas is used for persistent storage.  
Data is modeled using three collections: Board, List, and Card, reflecting a hierarchical structure.  
Mongoose is used to define schemas and enforce basic validation.

## Styling

Tailwind CSS is used for styling due to its flexibility and minimal configuration requirements.

## Metrics Collection

PostHog is integrated to collect product analytics.  
Events such as board, list, and card creation are tracked to analyze user interaction patterns and support data-driven decisions.

## Deployment

The application is deployed on Vercel with environment variables configured for MongoDB and PostHog.  
The same codebase is used for both development and production environments.
