export default function RecipesPage() {
  return (
    <main style={{padding: '24px', maxWidth: 900, margin: '0 auto'}}>
      <h1>Recipes</h1>
      <p>Welcome — this is a starter page for recipes. Add your recipes here.</p>

      <section style={{marginTop: 24}}>
        <article style={{padding: 12, borderRadius: 8, border: '1px solid rgba(255,255,255,0.04)', marginBottom: 16}}>
          <h2>Sample Recipe</h2>
          <p>Ingredients and instructions go here.</p>
        </article>
        
        <article style={{padding: 12, borderRadius: 8, border: '1px solid rgba(255,255,255,0.04)'}}>
          <h2>Chocolate Chip Cookies</h2>
          <p><strong>Ingredients:</strong></p>
          <ul>
            <li>2 cups all-purpose flour</li>
            <li>1 cup butter, softened</li>
            <li>3/4 cup granulated sugar</li>
            <li>3/4 cup brown sugar</li>
            <li>2 large eggs</li>
            <li>1 tsp vanilla extract</li>
            <li>1 tsp baking soda</li>
            <li>1 tsp salt</li>
            <li>2 cups chocolate chips</li>
          </ul>
          <p><strong>Instructions:</strong></p>
          <ol>
            <li>Preheat oven to 375°F (190°C)</li>
            <li>Cream together butter and sugars until fluffy</li>
            <li>Beat in eggs one at a time, then vanilla</li>
            <li>Mix in flour, baking soda, and salt</li>
            <li>Fold in chocolate chips</li>
            <li>Drop rounded tablespoons onto baking sheet</li>
            <li>Bake 9-11 minutes until golden brown</li>
            <li>Cool on baking sheet for 2 minutes before transferring</li>
          </ol>
        </article>
      </section>
    </main>
  );
}
