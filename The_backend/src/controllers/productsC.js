import Product from '../models/Product.js';
import Category from '../models/Category.js';

export const listProducts = async (req, res) => {
    try{ 
        const {category, latest, limit=12} = req.query;
        const query = {};

        if(category){
            const cat = await Category.findOne({
                $or: [{ _id: category}, {name: category}],
            });
            if(!cat){
          return res.status(400).json({message: "Category not found"}); }
            query.category = cat._id;
        }
        let dbQuery = Product.find(query).populate("category", "name");
        if(String(latest)=== "1") dbQuery = dbQuery.sort({createdAt: -1});
        dbQuery = dbQuery.limit(parseInt(limit, 10));
        const products = await dbQuery.exec();
        res.json(products);
    }catch (err){
        console.error("Error listing products:", err);
        res.status(500).json({message: "Server error"});
    }
};
export const getProduct = async (req, res) => {
    try{
        const {id} = req.params;
        const product = await Product.findById(id).populate("category", "name" );
        if(!product){
            return res.status(400).json({message:" Product not found"});
        }
        res.json(product);
    }catch(err){
        console.error("Error getting product by ID:", err);
        res.status(500).json({message: "Server error"});
    }
};

export const createProduct = async (req, res) => {
    try{
        const {title, slug, description ="", price, images=[], category, stock = 1, metadata = {}, } = req.body;
        if(!title || !slug || price == null || !category){
            return res.status(400).json({message: "Missing required fields"});
        }
        let cat = null;
        if(category){
            cat = await Category.findOne({
                $or: [{_id: category}, {name: category}],
            });
        }
        if(!cat) return res.status(400).json({message: "Category not found"});
        const existing = await Product.findOne({slug});
        if(existing){
            return res.status(400).json({message: "Slug alredy exists"});
        }
const product = await Product.create({
      title,
      slug,
      description,
      price,
      images,
      category: cat._id,
      owner: req.user ? req.user._id : undefined,
      stock,
      metadata,
    });

    const populated = await product.populate("category", "name").execPopulate?.() || await Product.findById(product._id).populate("category", "name");
    res.status(201).json(populated);
  } catch (err) {
    console.error("createProduct error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.owner && req.user && product.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden: you are not the owner" });
    }

    
    if (updates.category) {
      const cat = await Category.findOne({
        $or: [{ _id: updates.category }, { name: updates.category }],
      });
      if (!cat) return res.status(400).json({ message: "Category not found" });
      updates.category = cat._id;
    }

    Object.assign(product, updates);
    await product.save();

    const populated = await Product.findById(product._id).populate("category", "name");
    res.json(populated);
  } catch (err) {
    console.error("updateProduct error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.owner && req.user && product.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden: you are not the owner" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("deleteProduct error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
  