# MongoDB Implementation in BeautifySaloon

This document explains how MongoDB and Mongoose are implemented in the BeautifySaloon project, aimed at developers who are less experienced with these technologies.

## Table of Contents
- [Overview](#overview)
- [Database Connection Setup](#database-connection-setup)
- [Data Models](#data-models)
- [Authentication Integration](#authentication-integration)
- [API Implementation](#api-implementation)
- [Best Practices](#best-practices)

## Overview

BeautifySaloon uses MongoDB as its database, with Mongoose as the Object Data Modeling (ODM) library. This combination provides:

- Schema-based solution to model application data
- Built-in type casting
- Query building
- Business logic hooks (middleware)
- Data validation

## Database Connection Setup

The project uses two approaches for MongoDB connections:

### 1. Mongoose Connection (Primary Method)

Located in `lib/db.ts`, this approach uses Mongoose to connect to MongoDB:

```typescript
import mongoose from "mongoose";

// Connection function that caches the connection
async function dbConnect() {
  // Use global cache to prevent multiple connections during development
  if (cached.mongoose.conn) {
    return cached.mongoose.conn;
  }

  // Create a new connection if one doesn't exist
  if (!cached.mongoose.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.mongoose.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        return mongoose;
      });
  }
  
  cached.mongoose.conn = await cached.mongoose.promise;
  return cached.mongoose.conn;
}
```

Key features:
- Connection caching to prevent multiple connections
- Environment-specific configuration
- Error handling for missing connection string

### 2. MongoDB Native Client Connection

Located in `lib/mongodb.ts`, this provides a direct MongoDB client connection:

```typescript
import { MongoClient } from "mongodb";

// Different handling for development vs production
if (process.env.NODE_ENV === "development") {
  // Cache client in global variable during development
  // to prevent connection leaks during hot reloads
} else {
  // Create new client in production
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}
```

This approach is useful when you need the raw MongoDB client instead of using Mongoose.

## Data Models

The project uses Mongoose schemas and models to define the data structure. Models are located in the `/models` directory:

### User Model (`models/User.ts`)

```typescript
// Define interface for type safety
export interface IUser extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  // ...other fields
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Define schema with validation
const UserSchema = new mongoose.Schema<IUser>({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
  },
  // ...other fields
});

// Add password hashing middleware
UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Create and export model
export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
```

Similar patterns are used for other models:
- Salon Model (`models/Salon.ts`)
- Appointment Model (`models/Appointment.ts`) 
- Review Model (`models/Review.ts`)

### Key Model Features

1. **TypeScript Interfaces** - Define document structure for type safety
2. **Schema Validation** - Built-in data validation with custom error messages
3. **Pre/Post Hooks** - Middleware functions that run before/after operations
4. **Model Methods** - Custom functions attached to models (like `comparePassword`)
5. **References** - Links between documents using MongoDB ObjectIds

## Authentication Integration

The project integrates NextAuth with MongoDB for authentication:

```typescript
// In lib/auth.ts
async authorize(credentials) {
  if (!credentials?.email || !credentials?.password) {
    throw new Error("Email and password required");
  }

  await dbConnect();

  const user = await User.findOne({ email: credentials.email });

  if (!user) {
    throw new Error("Email or password is incorrect");
  }

  const isValid = await bcrypt.compare(
    credentials.password,
    user.password
  );

  if (!isValid) {
    throw new Error("Email or password is incorrect");
  }

  return {
    id: user._id.toString(),
    email: user.email,
    name: `${user.firstName} ${user.lastName}`,
    userType: user.userType,
  };
}
```

## API Implementation

API routes use the MongoDB models to perform database operations. Example from `app/api/salons/[id]/route.ts`:

```typescript
// GET endpoint to retrieve a specific salon by ID
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { id } = params;

    // Validate ID
    if (!id || id === "undefined") {
      return NextResponse.json(
        { error: "Invalid salon ID provided" },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Query using Mongoose model
    const salon = await Salon.findById(id)
      .populate("owner", "firstName lastName email -_id")
      .select("-__v");

    if (!salon) {
      return NextResponse.json(
        { error: "Salon not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(salon);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch salon" },
      { status: 500 }
    );
  }
}
```

## Best Practices

The project follows several best practices for MongoDB/Mongoose implementation:

1. **Connection Pooling** - Reuses database connections to improve performance
2. **Data Validation** - Validates data at the schema level before saving to the database
3. **Error Handling** - Proper try/catch blocks for database operations
4. **Secure Authentication** - Password hashing with bcrypt
5. **TypeScript Integration** - Interfaces for type safety with Mongoose
6. **Field Selection** - Uses `.select()` to only fetch required fields
7. **Document Population** - Uses `.populate()` to fetch related documents
8. **Model Separation** - Each model in its own file for better organization
9. **Environmental Configuration** - Different connection handling for development/production

## Common MongoDB/Mongoose Operations

Here are some common operations demonstrated in the codebase:

### Finding Documents
```typescript
const user = await User.findOne({ email: credentials.email });
const salon = await Salon.findById(id);
```

### Creating Documents
```typescript
const newSalon = new Salon({
  name: data.name,
  owner: session.user.id,
  // other fields...
});
await newSalon.save();
```

### Updating Documents
```typescript
await Salon.findByIdAndUpdate(id, updateData, { new: true });
```

### Querying with Filters
```typescript
const salons = await Salon.find(query)
  .populate("owner", "firstName lastName email -_id")
  .select("-__v")
  .sort({ createdAt: -1 });
```

### Relationships Between Collections
```typescript
// Reference in schema
owner: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: [true, "Salon owner is required"],
}

// Populate when querying
await Salon.findById(id).populate("owner");
```