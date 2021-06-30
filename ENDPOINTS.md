- [1. Легенда](#1-легенда)
- [2. Типы данных](#2-типы-данных)
- [3. Соглашения](#3-соглашения)
- [4. Attempt](#4-attempt)
	- [4.1. `GET`](#41-get)
		- [4.1.1. `/api/attempts/` - Взять список попыток.](#411-apiattempts---взять-список-попыток)
		- [4.1.2. `/api/attempts/?user=:id&task=:task_id` - Взять список попыток.](#412-apiattemptsuseridtasktask_id---взять-список-попыток)
	- [4.2. `POST`](#42-post)
		- [4.2.1. `/api/attempts/` - Создать новую попытку.](#421-apiattempts---создать-новую-попытку)
	- [4.3. `PUT`](#43-put)
		- [4.3.1. `/api/attempts/:attempt_id` - Редактировать попытку (Проверка преподавателем).](#431-apiattemptsattempt_id---редактировать-попытку-проверка-преподавателем)
- [5. Groups](#5-groups)
	- [5.1. `GET`](#51-get)
		- [5.1.1. `/api/groups/` - Взять список групп.](#511-apigroups---взять-список-групп)
	- [5.2. `POST`](#52-post)
		- [5.2.1. `/api/groups/` - Создать новую группу.](#521-apigroups---создать-новую-группу)
	- [5.3. `PUT`](#53-put)
		- [5.3.1. `/api/groups/:group_id` - Взять делальную информацию о группе.](#531-apigroupsgroup_id---взять-делальную-информацию-о-группе)
	- [5.4. `DELETE`](#54-delete)
		- [5.4.1. `/api/groups/:group_id` - Удалить группу.](#541-apigroupsgroup_id---удалить-группу)
- [6. Projects](#6-projects)
	- [6.1. `GET`](#61-get)
		- [6.1.1. `/api/projects/` - Взять проекты пользователя.](#611-apiprojects---взять-проекты-пользователя)
	- [6.2. `POST`](#62-post)
		- [6.2.1. `/api/projects/` - Создать новый проект.](#621-apiprojects---создать-новый-проект)
	- [6.3. `PUT`](#63-put)
		- [6.3.1. `/api/projects/:project_id` - Редактировать проект.](#631-apiprojectsproject_id---редактировать-проект)
	- [6.4. `DELETE`](#64-delete)
		- [6.4.1. `/api/project/:project_id` - Удалить проект.](#641-apiprojectproject_id---удалить-проект)
- [7. Tasks](#7-tasks)
	- [7.1. `GET`](#71-get)
		- [7.1.1. `/api/tasks/:project_id` - Взять задачи из проекта.](#711-apitasksproject_id---взять-задачи-из-проекта)
	- [7.2. `POST`](#72-post)
		- [7.2.1. `/api/tasks/` - Создать новую задачу.](#721-apitasks---создать-новую-задачу)
	- [7.3. `PUT`](#73-put)
		- [7.3.1. `/api/tasks/:task_id` - Изменить задачу.](#731-apitaskstask_id---изменить-задачу)
	- [7.4. `DELETE`](#74-delete)
		- [7.4.1. `/api/tasks/:task_id` - Удалить задачу.](#741-apitaskstask_id---удалить-задачу)
- [8. Users](#8-users)
	- [8.1. `GET`](#81-get)
		- [8.1.1. `/api/users/` - Взять данные пользователя.](#811-apiusers---взять-данные-пользователя)
		- [8.1.2. `/api/users/:group_id` - Взять пользователей из группы.](#812-apiusersgroup_id---взять-пользователей-из-группы)
	- [8.2. `POST`](#82-post)
		- [8.2.1. `/api/users/login` - Авторизация.](#821-apiuserslogin---авторизация)
		- [8.2.2. `/api/users/register` - Регистрация.](#822-apiusersregister---регистрация)
	- [8.3. `PUT`](#83-put)
		- [8.3.1. `/api/users/` - Редактирование учётной записи.](#831-apiusers---редактирование-учётной-записи)
		- [8.3.2. `/api/users/:user_id` - Редактирование учётной записи.](#832-apiusersuser_id---редактирование-учётной-записи)
	- [8.4. `HEAD`](#84-head)
		- [8.4.1. `/api/users/` - Проверка валидности токена сессии.](#841-apiusers---проверка-валидности-токена-сессии)
	- [8.5. `DELETE`](#85-delete)
		- [8.5.1. `/api/users/:user_id` - Удаление пользователя.](#851-apiusersuser_id---удаление-пользователя)
- [Validators](#validators)
	- [`GET`](#get)
		- [`/api/validators/` - Взять доступные валидаторы.](#apivalidators---взять-доступные-валидаторы)
		- [`/api/validators/:validator_id` - Взять детальную информацию о валидаторе.](#apivalidatorsvalidator_id---взять-детальную-информацию-о-валидаторе)
	- [`POST`](#post)
		- [`/api/validators/` - Создать новый валидатор.](#apivalidators---создать-новый-валидатор)
		- [`/api/validators/debug` - Проверка скипта.](#apivalidatorsdebug---проверка-скипта)
	- [`PUT`](#put)
		- [`/api/validators/:validator_id` - Изменение валидатора.](#apivalidatorsvalidator_id---изменение-валидатора)
	- [`DELETE`](#delete)
		- [`/api/validators/:validator_id` - Удаление валидатора.](#apivalidatorsvalidator_id---удаление-валидатора)
- [Variants](#variants)
	- [`GET`](#get-1)
		- [`/api/variants/` - Взять все варианты пользователя.](#apivariants---взять-все-варианты-пользователя)
	- [`POST`](#post-1)
		- [`/api/variants/:project_id` - Выдать новый вариант пользователю.](#apivariantsproject_id---выдать-новый-вариант-пользователю)



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
  * ...
* `bool` - Логическое значение. Принимает значения:
  * `true`
  * `false`
* `attempt_state` - Целочисленное значение принимает зачения:
  * `0` - Ожидет проверки валидатором (`PendingAutoChecking`).
  * `1` - Ожидает проверки преподавателем (`PendingChecking`).
  * `2` - Проверенно валидатором (`AutoChecked`).
  * `3` - Проверено преподавателем (`Checked`).
* `date` - Целочисленое значение, означающие дамп времени.

# 3. Соглашения
* Для того что-бы запрос считался авторизованым он должен содержать в заголовке токен сесии.
    ```
    Authorization: Bearer <token>
    ```
    Note: "Срок годности" токена сессии не более 1-го часа.


# 4. Attempt

## 4.1. `GET`

### 4.1.1. `/api/attempts/` - Взять список попыток.

- [x] Необходима авторизация.

Небходимые права доступа: `student` | `teacher` | `admin`.


Ответ:
```jsonc
[
    {
        "id":"id",
        "data":"string[2000]",
        "is_correct":"bool",
        "state":"attempt_state",
        "created_at":"date"
    }
]
```

### 4.1.2. `/api/attempts/?user=:id&task=:task_id` - Взять список попыток.

- [x] Необходима авторизация.

Небходимые права доступа: `teacher` | `admin`.

Ответ:
```jsonc
[
    {
        "id":"id",
        "data":"string[2000]",
        "is_correct":"bool",
        "state":"attempt_state",
        "created_at":"date"
    }
]
```

## 4.2. `POST`

### 4.2.1. `/api/attempts/` - Создать новую попытку.

- [x] Необходима авторизация.

Небходимые права доступа: `student` | `teacher` | `admin`.

Запрос:
```jsonc
{
    "task":"id",
    "data":"string[2000]",
}
```

## 4.3. `PUT`

### 4.3.1. `/api/attempts/:attempt_id` - Редактировать попытку (Проверка преподавателем).

- [x] Необходима авторизация.

Небходимые права доступа: `teacher` | `admin`.

Запрос:
```jsonc
{
    "is_correct":"bool",
}
```

# 5. Groups

## 5.1. `GET`
### 5.1.1. `/api/groups/` - Взять список групп.

- [x] Необходима авторизация.

Небходимые права доступа: `teacher` | `admin`.

Ответ:
```jsonc
[
    {
        "id":"id",
        "name":"string[50]"
    }
]
```

## 5.2. `POST`
### 5.2.1. `/api/groups/` - Создать новую группу.

- [x] Необходима авторизация.

Небходимые права доступа: `teacher` | `admin`.

Запрос:
```jsonc
{
    "name":"string[50]"
}
```

## 5.3. `PUT`
### 5.3.1. `/api/groups/:group_id` - Взять делальную информацию о группе.

- [x] Необходима авторизация.

Небходимые права доступа: `teacher` | `admin`.

Запрос:
```jsonc
{
    "name?":"string[50]"
}
```

## 5.4. `DELETE`
### 5.4.1. `/api/groups/:group_id` - Удалить группу.

- [x] Необходима авторизация.

Небходимые права доступа: `teacher` | `admin`.


Note: Также удаляет связаные `User`.

# 6. Projects

## 6.1. `GET`
### 6.1.1. `/api/projects/` - Взять проекты пользователя.

- [x] Необходима авторизация.

Небходимые права доступа: `student` | `teacher` | `admin`.

Ответ:
```jsonc
[
    {
        "id":"id",
        "name": "string[100]",
        "description":"string[2000]",
        "author":[
            {
                "id":"id",
                "lastname":"string[50]",
                "name":"string[50]",
                "surname":"string[50]"
            }
        ],
        "groups": [
          {
            "id":"id",
            "name":"string[50]"
          }
        ]
    }
]
```
Note:
* Для студентов возвращаються только назначеные их группе проекты.
* Для преподавателей возвращаються только созданые ими проекты.
* Для администаторов возвращаються все проекты.

## 6.2. `POST`
### 6.2.1. `/api/projects/` - Создать новый проект.

- [x] Необходима авторизация.

Небходимые права доступа: `teacher` | `admin`.

Запрос:
```jsonc
{
    "name": "string[100]",
    "description":"string[2000]",
    "tasks?":[
        "id"
    ],
    "groups?":[
        "id"
    ]
}
```

## 6.3. `PUT`
### 6.3.1. `/api/projects/:project_id` - Редактировать проект.

- [x] Необходима авторизация.

Небходимые права доступа: `teacher` | `admin`.

Запрос:
```jsonc
{
    "name?": "string[100]",
    "description?":"string[2000]",
    "tasks?":[
        "id"
    ],
    "groups?":[
        "id"
    ]
}
```

## 6.4. `DELETE`
### 6.4.1. `/api/project/:project_id` - Удалить проект.

- [x] Необходима авторизация.

Небходимые права доступа: `teacher` | `admin`.

Note: Также удаляет связаные `Task`, `Attempt`.

# 7. Tasks

## 7.1. `GET`
### 7.1.1. `/api/tasks/:project_id` - Взять задачи из проекта.

- [x] Необходима авторизация.

Небходимые права доступа: `student` | `teacher` | `admin`.

Ответ:
```jsonc
{
    "id":"id",
    "name":"string[100]",
    "description":"string[2000]",
}
```

## 7.2. `POST`
### 7.2.1. `/api/tasks/` - Создать новую задачу.

- [x] Необходима авторизация.

Небходимые права доступа: `teacher` | `admin`.

Запрос:
```jsonc
{
    "name": "string[100]",
    "description": "string[2000]",
    "validator?":"string[50]",
    "project": "id"
}
```

## 7.3. `PUT`
### 7.3.1. `/api/tasks/:task_id` - Изменить задачу.

- [x] Необходима авторизация.

Небходимые права доступа: `teacher` | `admin`.

Запрос:
```jsonc
{
    "name?": "string[100]",
    "description?": "string[2000]",
    "validator?":"string[50]",
    "project?": "id"
}
```

## 7.4. `DELETE`
### 7.4.1. `/api/tasks/:task_id` - Удалить задачу.

- [x] Необходима авторизация.

Небходимые права доступа: `teacher` | `admin`.

Note: Также удаляет связаные `Attempt`.

# 8. Users

## 8.1. `GET`
### 8.1.1. `/api/users/` - Взять данные пользователя.

- [x] Необходима авторизация.

Небходимые права доступа: `student` | `teacher` | `admin`.

Ответ:
```jsonc
{
    "name": "string[50]",
    "lastname": "string[50]",
    "surname": "string[50]",
    "role:":"role",
    "group?":{
        "id":"id",
        "name":"string[50]",
    },
    "email?": "email",
}
```

### 8.1.2. `/api/users/:group_id` - Взять пользователей из группы.

- [x] Необходима авторизация.

Небходимые права доступа: `teacher` | `admin`.

Ответ:
```jsonc
[
  {
      "name": "string[50]",
      "lastname": "string[50]",
      "surname": "string[50]",
  }
]
```

## 8.2. `POST`
### 8.2.1. `/api/users/login` - Авторизация.

- [ ] Необходима авторизация.

Небходимые права доступа: `student` | `teacher` | `admin`.

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

### 8.2.2. `/api/users/register` - Регистрация.

- [x] Необходима авторизация.

Небходимые права доступа: `teacher` | `admin`.

Запрос (регистрация студента):
```jsonc
{
    "login": "string[50]",
    "name": "string[50]",
    "lastname": "string[50]",
    "surname": "string[50]",
    "email?": "email",
    "role": "role",
    "group":"id"
}
```

Запрос (регистрация преподователя или администатора):
```jsonc
{
    "login": "string[50]",
    "name": "string[50]",
    "lastname": "string[50]",
    "surname": "string[50]",
    "email?": "email",
    "role": "role"
}
```

Ответ:
```jsonc
{
    "login":"string[50]",
    "password":"password"
}
```

## 8.3. `PUT`
### 8.3.1. `/api/users/` - Редактирование учётной записи.

- [x] Необходима авторизация.

Небходимые права доступа: `student` | `teacher` | `admin`.

Запрос:
```jsonc
{
    "password?":"password",
    "email?": "email",
}
```

### 8.3.2. `/api/users/:user_id` - Редактирование учётной записи.

- [x] Необходима авторизация.

Небходимые права доступа: `teacher` | `admin`.

Запрос:
```jsonc
{
    "name?": "string[50]",
    "lastname?": "string[50]",
    "surname?": "string[50]",
    "group?": "id",
}
```

## 8.4. `HEAD`
### 8.4.1. `/api/users/` - Проверка валидности токена сессии.

- [ ] Необходима авторизация.

Небходимые права доступа: `student` | `teacher` | `admin`.

Note: Если токен актуальный возвращает ответ с кодом `200`.
Если токен не правильный и/или срок его действия истёк возвращает ответ с кодом `403`.

## 8.5. `DELETE`
### 8.5.1. `/api/users/:user_id` - Удаление пользователя.

- [x] Необходима авторизация.

Небходимые права доступа: `teacher` | `admin`.


# Validators
## `GET`
### `/api/validators/` - Взять доступные валидаторы.

- [x] Необходима авторизация.

Небходимые права доступа: `teacher` | `admin`.

Ответ:
```jsonc
[
    {
        "id":"id",
        "name":"string[100]"
    }
]
```

### `/api/validators/:validator_id` - Взять детальную информацию о валидаторе.

- [x] Необходима авторизация.

Небходимые права доступа: `teacher` | `admin`.

Ответ:
```jsonc
{
    "id":"id",
    "name":"string[100]",
	"script":"string[20 000]"
}
```

## `POST`
### `/api/validators/` - Создать новый валидатор.

- [x] Необходима авторизация.

Небходимые права доступа: `teacher` | `admin`.

Запрос:
```jsonc
{
    "name":"string[100]",
	"script":"string[20 000]"
}
```

### `/api/validators/debug` - Проверка скипта.

- [x] Необходима авторизация.

Небходимые права доступа: `teacher` | `admin`.

Запрос:
```jsonc
{
    "data":"string[2 000]",
    "base?":"string[2 000]",
    "variant?":"string[2 000]",
	"script":"string[20 000]"
}
```

Ответ:
```jsonc
{
    "error?":"string[255]",
    "logs":[
		"string"
	],
    "result":"bool",
}
```

## `PUT`

### `/api/validators/:validator_id` - Изменение валидатора.

- [x] Необходима авторизация.

Небходимые права доступа: `teacher` | `admin`.

Запрос:
```jsonc
{
    "name?":"string[100]",
	"script?":"string[20 000]"
}
```

## `DELETE`

### `/api/validators/:validator_id` - Удаление валидатора.

- [x] Необходима авторизация.

Небходимые права доступа: `teacher` | `admin`.

# Variants
## `GET`
### `/api/variants/` - Взять все варианты пользователя.

- [x] Необходима авторизация.

Небходимые права доступа: `student` | `teacher` | `admin`.

Ответ:
```jsonc
[
    {
        "project":"id",
        "data":"string[2 000]"
    }
]
```

## `POST`
### `/api/variants/:project_id` - Выдать новый вариант пользователю.

- [x] Необходима авторизация.

Небходимые права доступа: `student` | `teacher` | `admin`.

Запрос:
```jsonc
{
	"project":"id",
	"data":"string[2 000]"
}
```
