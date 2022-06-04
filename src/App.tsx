import React from "react";

import { User as FirebaseUser } from "firebase/auth";
import {
  Authenticator,
  buildCollection,
  buildProperty,
  buildSchema,
  EntityReference,
  FirebaseCMSApp,
  Navigation,
  NavigationBuilder,
  NavigationBuilderProps
} from "@camberi/firecms";

import { projectSchema } from "./schemas/project_schema";

import "typeface-rubik";
import "typeface-space-mono";
import logo from "./images/favicon.png";

const firebaseConfig = {
  apiKey: "AIzaSyAYtLz9FaZHXJJNIeJ9gG4G3V9SZKhpXoY",
  authDomain: "adkaros-site.firebaseapp.com",
  projectId: "adkaros-site",
  storageBucket: "adkaros-site.appspot.com",
  messagingSenderId: "5264531907",
  appId: "1:5264531907:web:9483232ab92b0eb055dd76",
  measurementId: "G-6W64D23BPL"
};

const locales = {
  "en-US": "English (United States)",
  "es-ES": "Spanish (Spain)",
  "de-DE": "German"
};

const localeSchema = buildSchema({
  customId: locales,
  name: "Locale",
  properties: {
    title: {
      title: "Title",
      validation: { required: true },
      dataType: "string"
    },
    selectable: {
      title: "Selectable",
      description: "Is this locale selectable",
      dataType: "boolean"
    },
    video: {
      title: "Video",
      dataType: "string",
      validation: { required: false },
      config: {
        storageMeta: {
          mediaType: "video",
          storagePath: "videos",
          acceptedFiles: ["video/*"]
        }
      }
    }
  }
});

const projectCollection = buildCollection({
  path: "projects",
  schema: projectSchema,
  name: "Projects",
  permissions: ({ authController }) => ({
    edit: true,
    create: true,
    // we have created the roles object in the navigation builder
    delete: authController.extra.roles.includes("admin")
  }),
  subcollections: [
    buildCollection({
      name: "Locales",
      path: "locales",
      schema: localeSchema
    })
  ]
})

export default function App() {
  const navigation: NavigationBuilder = async ({
    user,
    authController
  }: NavigationBuilderProps) => {

    const navigation: Navigation = {
      collections: [
        projectCollection
      ],
    };

    return navigation;
  };

  const myAuthenticator: Authenticator<FirebaseUser> = async ({
    user,
    authController
  }) => {
    // Personal CMS, don't allow anybody but me!
    if (user?.email !== "karosandrew@gmail.com") {
      throw new Error("You are not authorized to access this site");
    }

    console.log("Allowing access to", user?.email);
    // This is an example of retrieving async data related to the user
    // and storing it in the user extra field.
    const sampleUserData = await Promise.resolve({
      roles: ["admin"]
    });
    authController.setExtra(sampleUserData);
    return true;
  };

  return <FirebaseCMSApp
    name={"Project CMS"}
    authentication={myAuthenticator}
    signInOptions={[
      'google.com',
    ]}
    navigation={navigation}
    firebaseConfig={firebaseConfig}
    logo={logo}
  />;
}