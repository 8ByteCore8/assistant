- [1. Легенда](#1-легенда)
- [2. Модуль Auth](#2-модуль-auth)
  - [2.1. `/api/auth` - Авторизация.](#21-apiauth---авторизация)
  - [2.2. `/api/auth/register` - Регистрация.](#22-apiauthregister---регистрация)



# 1. Легенда
* `[]`  - Опиционально.
* `<>`  - Объязателно.
* `|`   - Или.

# 2. Модуль Auth
## 2.1. `/api/auth` - Авторизация.
Запрос:
```jsonc
{
    "login":"<login>",
    "password":"<password>",
}
```
Ответ:
```jsonc
{
    "token":"<token>"
}
```

## 2.2. `/api/auth/register` - Регистрация.
Запрос:
```jsonc
{
    "login": "<login>",
    "password": "<password>",

    "name": "<name>",
    "lastname": "<lastname>",
    "surname": "<surname>",
    "email": "[email]",

    "role": "<Students|Teachers|Admins>",

    //Необходимо указывать при регистрации студентов.
    "group":"[group_id]",
}
```
Ответ:
```jsonc
{
    "token":"<token>"
}
```