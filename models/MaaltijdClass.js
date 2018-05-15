class MaaltijdClass {
    //Constructor die de attributen meegeeft voor andere classes.
    constructor(name, description, ingredients, allergies, price){
        this.name = name;
        this.description = description;
        this.ingredients = ingredients;
        this.allergies = allergies;
        this.price = price;
    }
}

module.exports = MaaltijdClass;