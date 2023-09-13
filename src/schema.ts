import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Rank {
    Title: String,
    Abbreviation: String,
    Grade: String,
    GradeId: String
  }

  type User {
    Rank: Rank
    Grade: String
    DUTYTITLE: String
    AMU: String
    DOD_ID: String
    ATP31: String
    AFC291_01: String
    AMF: String
    MPF: String
    MAJCOM: String
    Country: String
    BASE_LOC: String
    Org_type: String
    EOPDate: String
    Last_Name: String
    First_name: String
    Middle_Name: String
    ANB2: String
    CAS3: String
    CMD: String
    org_kind: String
    userType: String
    lastModifiedAt: String
  }

  type Query {
    getEnlistedUser(id: String!): User
  }

  type Query {
    getOfficerUser(id: String!): User
  }

  type Query {
    getUser(id: String!): User
  }
`;
