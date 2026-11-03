const productGroups = [
  {
    category: "Art Supplies",
    items: [
      ["Acrylic Colour Marker Set", 250],
      ["Acrylic Colour Paint Set", 220],
      ["Rainbow Colour Pencil Set", 180],
      ["Artist Colour Pencil Collection", 280],
      ["Artist Painting Canvas", 200],
      ["Oil Pastels", 150],
      ["Classic Paint Palette", 80],
      ["Artist Mixing Palette", 95],
      ["Artist Mixing Palette", 95],
      ["Premium Artist Palette", 160],
      ["Wax Seal Kit", 250],
      ["Pink Spiral Sketchbook", 180],
      ["Classic Artist Sketchbook", 200],
      ["Premium Drawing Sketchbook", 280],
      ["Watercolour Paint Palette", 220],
      ["Rainbow Watercolour Palette", 240],
      ["3D Rabbit Stickers", 70],
      ["Cute Character Stickers", 60],
      ["Pastel Decorative Stickers", 65],
      ["Hello Kitty Stickers", 75],
      ["Cute Cat & Dog Stickers", 70],
      ["Butterfly Stickers", 60],
    ],
  },
  {
    category: "Paper & Planning",
    items: [
      ["Hello Kitty & Friends 2027 Calendar", 250],
      ["Cute Cats 2027 Wall Calendar", 220],
      ["Lavender Dreams 2027 Desk Calendar", 180],
      ["Floral Elegance 2027 Desk Calendar", 200],
      ["Classic School Copybook Set", 150],
      ["Classic School Copybook Set", 150],
      ["Classic School Copybook Set", 150],
      ["Floral School Copybook Set (x4)", 240],
      ["Floral Daily Diary", 220],
      ["Pastel Personal Diary", 180],
      ["Pastel Spiral Notebook", 160],
      ["Floral Study Notebook", 190],
      ["Cute Cat Notebook", 180],
      ["Cute Koala Notebook", 180],
      ["Cute Rabbit Notebook", 180],
      ["Cute Mocha Notebook", 180],
      ["Floral Notebook Set", 250],
      ["Kawaii Dino Notebook Bundle", 260],
      ["Cherry Blossom Notebook Set", 250],
      ["Aesthetic Study Notebook Set", 240],
      ["Daily Planner", 220],
      ["Daily Planner", 220],
      ["Weekly Planner", 200],
      ["Daily Planner", 220],
      ["Cute Cat Sticky Notes", 90],
      ["Mini Reminder Notes", 70],
      ["Hello Kitty Sticky Notes", 100],
      ["Purple Memo Notes", 80],
      ["Pink Memo Notes", 80],
      ["Cute Daily To-Do List Pad", 120],
      ["Pastel Spiral To-Do List Pad", 140],
    ],
  },
  {
    category: "Everyday Essentials",
    items: [
      ["Blush Pink Calculator", 250],
      ["Pastel Pink Scientific Calculator", 650],
      ["Lavender Scientific Calculator", 650],
      ["Pastel Clear Bag", 180],
      ["Hello Kitty Writing Clipboard", 150],
      ["Classic Hello Kitty Writing Clipboard", 150],
      ["Kuromi Writing Clipboard", 150],
      ["Colour Pen Set 1", 150],
      ["Colour Pen Set 2", 150],
      ["Complete Study Starter Set", 450],
      ["Pastel School Essentials Bundle", 380],
      ["Everyday Writing Kit", 250],
      ["Student Stationery Set", 350],
      ["Cute Panda Desk Essentials Set", 300],
      ["Back-to-School Supply Bundle", 500],
      ["Colourful Notes Stationery Set", 280],
      ["Study Desk Companion Kit", 350],
      ["Creative Student Essentials", 400],
      ["All-in-One Stationery Bundle", 550],
      ["Hello Kitty Stationery Set", 350],
      ["Milk and Mocha Stationery Set", 350],
      ["Pastel Blue Correction Tape", 65],
      ["Pastel Pink Correction Tape", 65],
      ["Precision Craft Cutter", 90],
      ["Classic Eraser", 25],
      ["Cute Mini Eraser", 35],
      ["Cute Kuromi Eraser", 45],
      ["Complete Geometry Set", 180],
      ["Pastel Study Highlighters", 150],
      ["Bright Colour Highlighter Set", 160],
      ["Everyday Highlighting Pens", 120],
      ["Everyday Writing Pen", 35],
      ["Everyday Writing Pen", 35],
      ["Everyday Writing Pen", 35],
      ["Classic HB Writing Pencils", 80],
      ["Floral Pencil Pouch", 140],
      ["Pastel Pencil Case", 160],
      ["Transparent Pencil Case", 120],
      ["Pastel Gel Pen Collection", 180],
      ["Blue Ink Pen Set", 100],
      ["Black Ink Pen Set", 100],
      ["Fine-Tip Colour Pen Bundle", 180],
      ["Premium Study Pen Bundle", 220],
      ["Rose Pink Ruler", 50],
      ["Floral Pattern Ruler", 55],
      ["Cute Teddy Bear Scissors", 85],
      ["Hello Kitty Scissors", 95],
    ],
  },
  
];

const descriptions = {
  "Art Supplies":
    "Bring your creative ideas to life with this fun addition to your stationery collection.",
  "Paper & Planning":
    "Keep your notes, plans and daily tasks organised with this practical paper essential.",
  "Everyday Essentials":
    "A handy everyday stationery essential for school, university or your study desk.",
};

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/\(x4\)/g, "x4")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const categories = [
  "All Products",
  "Paper & Planning",
  "Everyday Essentials",
  "Art Supplies",
];

export const products = productGroups.flatMap((group) =>
  group.items.map(([name, price], index) => {
    const id = `P${String(
      productGroups
        .slice(0, productGroups.indexOf(group))
        .reduce((total, previous) => total + previous.items.length, 0)
        + index + 1
    ).padStart(3, "0")}`;

    return {
      id,
      name,
      category: group.category,
      price,
      description: `${name} — ${descriptions[group.category]}`,
      imageFile: `${id}-${slugify(name)}.png`,
      image: null,
    };
  })
);


console.log("Total products:", products.length);