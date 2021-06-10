import value from "*.json";
import { JsonSQLite } from "@capacitor-community/sqlite";

export const db :JsonSQLite = {
  database: "cash_in_db",
  version: 1,
  encrypted: false,
  mode: "full",
  tables: [
    {
      name: "user",
      schema: [
        { column: "id", value: "TEXT PRIMARY KEY NOT NULL" },
        { column: "email", value: "TEXT NOT NULL" },
        { column: "firstname", value: "TEXT NOT NULL" },
        { column: "name", value: "TEXT NOT NULL" },
        { column: "phone", value: "TEXT NOT NULL" },
      ]
      // values: [
      //   ["1","t@gmail.com", "Dimitri", "TCHUEM","699778855"],
      // ]
    },
    {
      name: "collection",
      schema: [
        { column: "id_collection", value: "TEXT PRIMARY KEY NOT NULL" },
        { column: "name", value: "TEXT NOT NULL" },
        { column: "date", value: "TEXT NOT NULL" },
        { column: "id_user", value: "TEXT NOT NULL" },
        {
          foreignkey: "id_user",
          value: "REFERENCES user(id) ON DELETE CASCADE"
        },
      ],
    },
    {
      name: "customer",
      schema: [
        { column: "id_customer", value: "TEXT PRIMARY KEY NOT NULL" },
        { column: "firstname", value: "TEXT NOT NULL" },
        { column: "name", value: "TEXT NOT NULL" },
        { column: "email", value: "TEXT NOT NULL" },
        { column: "phone", value: "TEXT NOT NULL" },
        { column: "accountnumber", value: "TEXT NOT NULL" },
      ],
    },
    {
      name: "collection_line",
      schema: [
        { column: "id_collection_line", value: "TEXT PRIMARY KEY NOT NULL" },
        { column: "amount", value: "INTEGER NOT NULL" },
        { column: "date", value: "TEXT NOT NULL" },
        { column: "id_customer", value: "TEXT NOT NULL" },
        { column: "id_collecte", value: "TEXT NOT NULL" },
        {
          foreignkey: "id_customer",
          value: "REFERENCES customer(id_customer) ON DELETE CASCADE"
        },
        {
          foreignkey: "id_collecte",
          value: "REFERENCES collection(id_collection) ON DELETE CASCADE"
        }
      ],
    },
  ],
};





// ,
//       values: [
//         ["t@gmail.com", "Dimitri", "TCHUEM","699778855"],
//       ]

// ,
//       values: [
//         ["1", "Collection1", "25-05-2021","t@gmail.com"],
//         ["2", "Collection2", "26-05-2021","t@gmail.com"],
//         ["3", "Collection3", "27-05-2021","t@gmail.com"],
//       ],




// {
//   "database": "cash_in_db",
//   "version": 1,
//   "encrypted": false,
//   "mode": "full",
//   "tables": [
//     {
//       "name": "user",
//       "schema": [
//         { "column": "email", "value": "TEXT PRIMARY KEY NOT NULL" },
//         { "column": "firstname", "value": "TEXT NOT NULL" },
//         { "column": "name", "value": "TEXT NOT NULL" },
//         { "column": "phone", "value": "TEXT NOT NULL" }
//       ]
//     },
    // {
    //   "name": "collection",
    //   "schema": [
    //     { "column": "id_collection", "value": "TEXT PRIMARY KEY NOT NULL" },
    //     { "column": "name", "value": "TEXT NOT NULL" },
    //     { "column": "date", "value": "TEXT NOT NULL" },
    //     {
    //       "foreignkey": "email_user",
    //       "value": "REFERENCES user(email)"
    //     }
    //   ],
    //   "values": [
    //     ["1", "Collection1", "25-05-2021", "tsg@gmail.com"],
    //     ["2", "Collection2", "26-05-2021", "tsg@gmail.com"],
    //     ["3", "Collection3", "27-05-2021", "tsg@gmail.com"]
    //   ]
    // },
    // {
    //   "name": "customer",
    //   "schema": [
    //     { "column": "id_customer", "value": "TEXT PRIMARY KEY NOT NULL" },
    //     { "column": "firstname", "value": "TEXT NOT NULL" },
    //     { "column": "name", "value": "TEXT NOT NULL" },
    //     { "column": "email", "value": "TEXT NOT NULL" },
    //     { "column": "phone", "value": "TEXT NOT NULL" },
    //     {
    //       "foreignkey": "id_collection",
    //       "value": "REFERENCES collection(id_collection)"
    //     }
    //   ]
    // },
    // {
    //   "name": "collection_line",
    //   "schema": [
    //     { "column": "id_collection_line", "value": "TEXT PRIMARY KEY NOT NULL" },
    //     { "column": "amount", "value": "INTEGER NOT NULL" },
    //     { "column": "date", "value": "TEXT NOT NULL" },
    //     {
    //       "foreignkey": "id_customer",
    //       "value": "REFERENCES customer(id_customer)"
    //     }
    //   ]
    // }
//   ]
// };
