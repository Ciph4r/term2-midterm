# Lose it 

## Table Of content
1. User Routes
2. Diet Plan Routes
3. How to Use
4. Technoligy Used



## Routes Base Path: /api/v1

### user routes /user
1. post `/register`
2. get `/register-update/:name/:password`
3. get `/login`
4. post `/login`
5. get `/logout`
6. get `/account`
7. put `/account`
8. get `/profile`
9. put `/profile`
10. get `/profileEdit`
11. get `/add-goal`
12. put `/add-goal`
13. put `/weigh-in`

### dietplan routes /dietplan

1. get `/`
2. post `/add-diet`
3. get `/add-meal`
4. get `/show-meals/:dietPlan_id`
5. get `/food-search/:meals_id`
6. get `/findfood`
7. put `/add-food`
8. put `/remove-item/:meal_id`


## Technology Stack
1. JavaScript
2. Mongoose
3. MongoDB
4. Passport
5. Express



## things to add at the end
### send a comfirmation email when user change account settings

## edge case to be fix at a later date
### user can log in with temp password/username
### need to add check for complete date to be greater than date now
////////////////////////////////////////