# Building Buddies API

[![Build Status](https://travis-ci.org/laurakwhit/travis-test.svg?branch=master)](https://travis-ci.org/laurakwhit/travis-test)

* Resonses are in JSON format

## Table of Contents

* [Buildings](#buildings)
* [Users](#users)
* [Interests](#interests)
* [User Interests](#user-interests)

## 🏢 Buildings

### GET

Get all buildings ```/api/v1/buildings```

Example Response:

```
[
  {
     id: 1,
     name: "Modera Observatory Park",
     address: "1910 S Josephine St Denver, CO ",
     created_at: "2018-10-11T19:19:04.083Z",
     updated_at: "2018-10-11T19:19:04.083Z"
  },
  {
     id: 2,
     name: "The Modern Apartment Homes",
     address: "6301 W Hampden Ave Denver, CO ",
     created_at: "2018-10-11T19:19:04.083Z",
     updated_at: "2018-10-11T19:19:04.083Z"
  }
]
```
Get building by id ```/api/v1/buildings/:building_id```

Example Response:

```
{
  id: 1,
  name: "Modera Observatory Park",
  address: "1910 S Josephine St Denver, CO ",
  created_at: "2018-10-11T19:19:04.083Z",
  updated_at: "2018-10-11T19:19:04.083Z"
}
```

### POST

Create a new building ```/api/v1/buildings/```

Example Request:
```
{
  name: "Modera Observatory Park",
  address: "1910 S Josephine St Denver, CO ",
}
```

Example Response:

```
{ id: 1 }
```

### PUT

Edit an existing building ```/api/v1/buildings/:building_id```

Example Request:
```
{
  name: "Modera Observatory",
  address: "1910 S Josephine St Denver, CO ",
}
```

Example Response:

```
{ id: 1 }
```

### DELETE

Delete an existing building ```/api/v1/buildings/:building_id```

Example Request:
```
{ id: 1 }
```

Example Response:

```
{ message: "Building 1 was successfully deleted." }
```

## 👩‍💻 Users

## ⛳ Interests

### GET

Get all interests ```/api/v1/interests```

Example Response:

```
[
  {
     id: 1,
     name: "golf",
     created_at: "2018-10-10T19:53:00.107Z",
     updated_at: "2018-10-10T19:53:00.107Z"
   },
   {
     id: 2,
     name: "gardening",
     created_at: "2018-10-10T19:53:00.107Z",
     updated_at: "2018-10-10T19:53:00.107Z"
   }
]
```

### POST

Create a new interest ```/api/v1/interests```

Example Request:

```
{ name: "coding" }
```

Example Response:

```
{ id: 1 }
```
## 🏌️ User Interests
