class MaaltijdClass {
    //Constructor die de attributen meegeeft voor andere classes.
    constructor(name, description, ingredients, allergies, price){
        this.naam = name;
        this.beschrijving = description;
        this.ingredienten = ingredients;
        this.allergie = allergies;
        this.prijs = price;
    }
}

module.exports = MaaltijdClass;