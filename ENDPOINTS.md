- [1. Легенда](#1-легенда)
- [2. Типы данных](#2-типы-данных)
- [3. Соглашения](#3-соглашения)
- [4. Users](#4-users)
  - [4.1. `POST` `/api/users/login` - Авторизация.](#41-post-apiuserslogin---авторизация)
  - [4.2. `POST` `/api/users/register` - Регистрация.](#42-post-apiusersregister---регистрация)
  - [4.3. `HEAD` `/api/users/` - Проверка валидности токена сессии.](#43-head-apiusers---проверка-валидности-токена-сессии)
  - [4.4. `GET` `/api/users/` - Взять данные пользователя.](#44-get-apiusers---взять-данные-пользователя)
  - [4.5. `PUT` `/api/users/` - Редактирование учётной записи.](#45-put-apiusers---редактирование-учётной-записи)
- [5. Projects](#5-projects)
  - [5.1. `GET` `/api/projects/` - Взять проекты пользователя с задачами.](#51-get-apiprojects---взять-проекты-пользователя-с-задачами)
  - [5.2. `GET` `/api/projects/:project_id` - Взять проект с задачами.](#52-get-apiprojectsproject_id---взять-проект-с-задачами)
  - [5.3. `POST` `/api/projects/` - Создать новый проект.](#53-post-apiprojects---создать-новый-проект)
  - [5.4. `PUT` `/api/projects/` - Редактировать проект.](#54-put-apiprojects---редактировать-проект)



# 1. Легенда
* `?`  - Опиционально. Иными словами, данный параметр может отсутствовать в теле запроса/ответа или содержать значение `null`.


# 2. Типы данных

* `id` - Целое позитивное число.
* `email` - Стройное значение со всеми спецификациями email.
* `password` - Стройное значение с минимальной длиной в 8 символов.
* `role` - Может содержать 3 значения:
  * `Students`
  * `Teachers`
  * `Admins`
* `string[max]` - Строчное значение с указанием максимальной длины.
* `string[nim, max]` - Строчное значение с указанием минимальной и максимальной длины.
* `token` - Строчное значение которое соответствует спецификации JWT.
* `validator` - Строчное значение которое может принимать значения:


# 3. Соглашения
* Для того что-бы запрос считался авторизованым он должен содержать в заголовке токен сесии.
    ```
    Authorization: Bearer <token>
    ```
    Note: "Срок годности" токена сессии не более 1-го часа.


# 4. Users
## 4.1. `POST` `/api/users/login` - Авторизация.

- [ ] Необходима авторизация

Запрос:
```jsonc
{
    "login":"string[50]",
    "password":"string",
}
```
Ответ:
```jsonc
{
    "token":"token"
}
```

## 4.2. `POST` `/api/users/register` - Регистрация.

- [x] Необходима авторизация

Небходимые права доступа:
* `can_register`
* `can_register_<role>`

Запрос:
```jsonc
{
    "login": "string[50]",
    "password?":"password",

    "name": "string[50]",
    "lastname": "string[50]",
    "surname": "string[50]",
    "email?": "email",

    "role": "role",

    //Необходимо указывать при регистрации студентов.
    "group?":"id",
}
```
Ответ:
```jsonc
{
    "login":"string[50]",
    "password":"password"
}
```


## 4.3. `HEAD` `/api/users/` - Проверка валидности токена сессии.

- [ ] Необходима авторизация

Note: Если токен актуальный возвращает ответ с кодом `200`.
Если токен не правильный и/или срок его действия истёк возвращает ответ с кодом `403`.

## 4.4. `GET` `/api/users/` - Взять данные пользователя.

- [x] Необходима авторизация

Ответ:
```jsonc
{
    "name": "string[50]",
    "lastname": "string[50]",
    "surname": "string[50]",
    "email": "email",
}
```
## 4.5. `PUT` `/api/users/` - Редактирование учётной записи.

- [x] Необходима авторизация

Запрос:
```jsonc
{
    "password?":"password",
    "email?": "email",
}
```
Note: Редактирует только полученные в запросе данные.

# 5. Projects

## 5.1. `GET` `/api/projects/` - Взять проекты пользователя с задачами.

- [x] Необходима авторизация

Ответ:
```jsonc
[
    {
        "id":"id",
        "name": "string[100]",
        "description":"string[2000]",
        "tasks":[
            {
                "id":"id",
                "name":"string[100]",
                "description":"string[2000]"
            }
        ]
    }
]
```

## 5.2. `GET` `/api/projects/:project_id` - Взять проект с задачами.

- [ ] Необходима авторизация

Ответ:
```jsonc
{
    "id":"id",
    "name": "string[100]",
    "description":"string[2000]",
    "tasks":[
        {
            "id":"id",
            "name":"string[100]",
            "description":"string[2000]"
        }
    ]
}
```

## 5.3. `POST` `/api/projects/` - Создать новый проект.

- [x] Необходима авторизация

Небходимые права доступа:
* `can_create_project`

Запрос:
```jsonc
{
    "name": "string[100]",
    "description":"string[2000]",
    "tasks":[
        {
            "name":"string[100]",
            "description":"string[2000]",
            "validator?": "validator"
        }
    ],
    "groups?":[
        "id"
    ]
}
```

Ответ:
```jsonc
{
    "id":"id",
    "name": "string[100]",
    "description":"string[2000]",
    "tasks":[
        {
            "id":"id",
            "name":"string[100]",
            "description":"string[2000]",
            "validator?": "<validator>"
        }
    ]
}
```


## 5.4. `PUT` `/api/projects/` - Редактировать проект.

- [x] Необходима авторизация

Небходимые права доступа:
* `can_edit_project`

Запрос:
```jsonc
{
    "id":"id",
    "name": "string[100]",
    "description":"string[2000]",
    "tasks":[
        {
            "id?":"id",
            "name":"string[100]",
            "description":"string[2000]",
            "validator?": "validator"
        }
    ]
}
```

Ответ:
```jsonc
{
    "id":"id",
    "name": "string[100]",
    "description":"string[2000]",
    "tasks":[
        {
            "id":"id",
            "name":"string[100]",
            "description":"string[2000]",
            "validator?": "validator"
        }
    ]
}
```