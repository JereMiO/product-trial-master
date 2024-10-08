// Test pour vérifier le code de statut
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Test pour vérifier que la réponse est au format JSON
pm.test("Response is in JSON format", function () {
    pm.response.to.be.json;
});

// Test pour vérifier la structure et le contenu du produit
pm.test("Product has correct structure and data", function () {
    const jsonData = pm.response.json();

    // Vérifier que toutes les propriétés attendues sont présentes
    pm.expect(jsonData).to.have.property('id');
    pm.expect(jsonData).to.have.property('name');
    pm.expect(jsonData).to.have.property('description');
    pm.expect(jsonData).to.have.property('price');
    pm.expect(jsonData).to.have.property('category');
    pm.expect(jsonData).to.have.property('inventoryStatus');

    // Vérifier que l'ID dans la réponse correspond à l'ID demandé
    pm.expect(jsonData.id).to.eql(parseInt(pm.variables.get("id")));

    // Vérifier les types de données
    pm.expect(jsonData.id).to.be.a('number');
    pm.expect(jsonData.name).to.be.a('string');
    pm.expect(jsonData.description).to.be.a('string');
    pm.expect(jsonData.price).to.be.a('number');
    pm.expect(jsonData.category).to.be.a('string');
    pm.expect(jsonData.inventoryStatus).to.be.a('string');

    // Vérifier que le statut d'inventaire est valide
    pm.expect(['INSTOCK', 'LOWSTOCK', 'OUTOFSTOCK']).to.include(jsonData.inventoryStatus);

    // Afficher les détails du produit dans la console pour une inspection facile
    console.log("Product details:", jsonData);
});

// Test pour vérifier la performance (temps de réponse)
pm.test("Response time is less than 200ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(200);
});
