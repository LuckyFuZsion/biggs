// Source: Joe's "Biggs - Allergen" document. Keyed by flavour name with punctuation stripped, lower case.
export interface AllergenInfo {
  contains: string;
  mayContain: string;
  ingredients: string;
}

export function allergenKey(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export const ALLERGEN_INFO: Record<string, AllergenInfo> = {
  chocolatechip: {
    contains: "Wheat (Gluten), Milk, Egg, Soya",
    mayContain: "Nuts",
    ingredients: "Self-raising WHEAT flour (WHEAT flour, calcium carbonate, iron, nicotinamide, thiamin, raising agents (monocalcium phosphate, sodium bicarbonate)), light brown soft sugar, butter (MILK), Callebaut milk chocolate (sugar, cocoa butter, whole MILK powder, cocoa mass, emulsifier (SOYA lecithin), natural vanilla flavouring), Cadbury Dairy Milk chocolate (milk chocolate (MILK, sugar, cocoa butter, cocoa mass, vegetable fats (palm, shea), emulsifiers (E442, E476), flavourings)), plain WHEAT flour (WHEAT flour, calcium carbonate, iron, nicotinamide, thiamin), strong white bread WHEAT flour (WHEAT flour, calcium carbonate, iron, niacin, thiamin), caster sugar, EGG, EGG yolk, vanilla extract (invert sugar syrup, glucose syrup, water, glycerol, vanilla extract (vanilla beans, alcohol, water)), fine sea salt.",
  },
  redvelvet: {
    contains: "Wheat (Gluten), Milk, Egg, Soya",
    mayContain: "Nuts",
    ingredients: "Self-raising WHEAT flour (WHEAT flour, calcium carbonate, iron, nicotinamide, thiamin, raising agents (monocalcium phosphate, sodium bicarbonate)), butter (MILK), light brown soft sugar, Callebaut white chocolate (sugar, cocoa butter, whole MILK powder, emulsifier (SOYA lecithin), natural vanilla flavouring), Milkbar white chocolate (sugar, cocoa butter, whole MILK powder, glucose syrup, emulsifier (lecithins), natural vanilla flavouring), plain WHEAT flour (WHEAT flour, calcium carbonate, iron, nicotinamide, thiamin), strong white bread WHEAT flour (WHEAT flour, calcium carbonate, iron, niacin, thiamin), caster sugar, EGG, EGG yolk, cocoa powder (cocoa powder, acidity regulator (potassium carbonates)), vanilla extract (invert sugar syrup, glucose syrup, water, glycerol, vanilla extract (vanilla beans, alcohol, water)), red food colouring (glycerol (E422), silica (E551), colours (E124, E129)), fine sea salt, freeze-dried raspberries (100%).",
  },
  cookiescream: {
    contains: "Wheat (Gluten), Milk, Egg, Soya",
    mayContain: "Nuts",
    ingredients: "Self-raising WHEAT flour (WHEAT flour, calcium carbonate, iron, nicotinamide, thiamin, raising agents (monocalcium phosphate, sodium bicarbonate)), butter (MILK), light brown soft sugar, Callebaut white chocolate (sugar, cocoa butter, whole MILK powder, emulsifier (SOYA lecithin), natural vanilla flavouring), Oreo cookies (WHEAT flour, sugar, palm oil, rapeseed oil, WHEAT starch, fat-reduced cocoa powder, glucose- fructose syrup, raising agents (ammonium carbonates, potassium carbonates, sodium carbonates), salt, emulsifier (SOYA lecithins), acidity regulator (sodium hydroxide), flavourings), plain WHEAT flour (WHEAT flour, calcium carbonate, iron, nicotinamide, thiamin), strong white bread WHEAT flour (WHEAT flour, calcium carbonate, iron, niacin, thiamin), caster sugar, EGG, EGG yolk, Hershey’s Cookies ’n’ Creme chocolate (sugar, vegetable oils (palm, sunflower, palm kernel), skimmed MILK powder, corn syrup solids, WHEAT flour, lactose (MILK), cocoa powder, emulsifier (SOYA lecithin), MILK powder, raising agent (E500(ii)), cocoa mass, flavourings), vanilla extract (invert sugar syrup, glucose syrup, water, glycerol, vanilla extract (vanilla beans, alcohol, water)), fine sea salt, Milkbar white chocolate drizzle (sugar, cocoa butter, whole MILK powder, glucose syrup, emulsifier (lecithins), natural vanilla flavouring).",
  },
  biscoffwhitechocolate: {
    contains: "Wheat (Gluten), Milk, Egg",
    mayContain: "Nuts",
    ingredients: "Self-raising WHEAT flour (WHEAT flour, calcium carbonate, iron, nicotinamide, thiamin, raising agents (monocalcium phosphate, sodium bicarbonate)), butter (MILK), light brown soft sugar, Callebaut white chocolate (sugar, cocoa butter, whole MILK powder, emulsifier (SOYA lecithin), natural vanilla flavouring), Milkybar white chocolate (sugar, cocoa butter, whole MILK powder, glucose syrup, emulsifier (lecithins), natural vanilla flavouring), plain WHEAT flour (WHEAT flour, calcium carbonate, iron, nicotinamide, thiamin), strong white bread WHEAT flour (WHEAT flour, calcium carbonate, iron, niacin, thiamin), caster sugar, Lotus Biscoff biscuits (WHEAT flour, sugar, vegetable oils (palm, rapeseed), candy sugar syrup, raising agent (sodium hydrogen carbonate), SOYA flour, salt, cinnamon), EGG, EGG yolk, Lotus Biscoff spread (caramelised biscuits 58% (WHEAT flour, sugar, vegetable oils (palm, rapeseed), candy sugar syrup, raising agent (sodium hydrogen carbonate), SOYA flour, salt, cinnamon), rapeseed oil, sugar, emulsifier (lecithins (SOYA), acid (citric acid)), vanilla extract (invert sugar syrup, glucose syrup, water, glycerol, vanilla extract (vanilla beans, alcohol, water)), fine sea salt.",
  },
  smores: {
    contains: "Wheat (Gluten), Milk, Egg",
    mayContain: "Nuts",
    ingredients: "Self-raising WHEAT flour (WHEAT flour, calcium carbonate, iron, nicotinamide, thiamin, raising agents (monocalcium phosphate, sodium bicarbonate)), butter (MILK), light brown soft sugar, milk chocolate chips (sugar, cocoa butter, whole MILK powder, cocoa mass, emulsifier (SOYA lecithin), natural vanilla flavouring), digestive biscuits (WHEAT flour, vegetable oil (palm), wholemeal WHEAT flour, sugar, partially inverted sugar syrup, raising agents (sodium bicarbonate, malic acid, ammonium bicarbonate), salt), plain WHEAT flour (WHEAT flour, calcium carbonate, iron, nicotinamide, thiamin), strong white bread WHEAT flour (WHEAT flour, calcium carbonate, iron, niacin, thiamin), caster sugar, EGG, EGG yolk, mini marshmallows (glucose syrup, sugar, dextrose, water, humectant (sorbitol syrup), gelatine, fruit and plant concentrates (beetroot, safflower), flavouring), Dairy Milk chocolate (milk chocolate (MILK, sugar, cocoa butter, cocoa mass, vegetable fats (palm, shea), emulsifiers (E442, E476), flavourings), marshmallow (glucose syrup, sugar, water, maize starch, beef gelatine, flavourings, beetroot concentrate), vanilla extract (invert sugar syrup, glucose syrup, water, glycerol, vanilla extract (vanilla beans, alcohol, water)), fine sea salt.",
  },
  brookie: {
    contains: "Wheat (Gluten), Milk, Egg",
    mayContain: "Nuts",
    ingredients: "self-raising WHEAT flour (WHEAT flour, calcium carbonate, iron, nicotinamide, thiamin, raising agents (monocalcium phosphate, sodium bicarbonate)), butter (MILK), light brown soft sugar, milk chocolate chips (sugar, cocoa butter, whole MILK powder, cocoa mass, emulsifier (SOYA lecithin)), Dairy Milk chocolate chunks (milk chocolate (MILK, sugar, cocoa butter, cocoa mass, vegetable fats (palm, shea), emulsifiers (E442, E476), flavourings), dark chocolate chunks (cocoa mass, sugar, MILK (lactose), emulsifier (SOYA lecithins), plain WHEAT flour (WHEAT flour, calcium carbonate, iron, nicotinamide, thiamin), strong white bread WHEAT flour (WHEAT flour, calcium carbonate, iron, niacin, thiamin), caster sugar, EGG, EGG yolk, cocoa powder (cocoa powder, acidity regulator (potassium carbonates)), vanilla extract (invert sugar syrup, glucose syrup, water, glycerol, vanilla extract (vanilla beans, alcohol, water)), fine sea salt.",
  },
};
