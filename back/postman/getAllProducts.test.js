pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response is an array", function () {
    var jsonData = pm.response.json();
    pm.expect(Array.isArray(jsonData)).to.be.true;
});

pm.test("Products have required fields", function () {
    var jsonData = pm.response.json();
    if (jsonData.length > 0) {
        pm.expect(jsonData[0]).to.have.property('id');
        pm.expect(jsonData[0]).to.have.property('name');
        pm.expect(jsonData[0]).to.have.property('price');
    }
});

pm.test("Product with ID 1000 exists", function () {
    var jsonData = pm.response.json();
    var productExists = jsonData.some(function(product) {
        return product.id === 1000;
    });

    pm.expect(productExists).to.be.true;

    if (productExists) {
        var product = jsonData.find(function(p) {
            return p.id === 1000;
        });

        pm.expect(product).to.have.property('name');
        pm.expect(product).to.have.property('price');
        // Ajoutez d'autres vérifications spécifiques si nécessaire
        console.log("Product with ID 1000:", product);
    } else {
        console.log("Product with ID 1000 not found");
    }
});
