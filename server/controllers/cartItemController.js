const CartItem = require('../models/CartItems');

exports.getAllCartItems = async (req, res) => {
  try {
    const cartItems = await CartItem.findAll();
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
};

exports.getCartItemById = async (req, res) => {
  try {
    const cartItem = await CartItem.findByPk(req.params.id);
    if (cartItem) {
      res.json(cartItem);
    } else {
      res.status(404).json({ error: 'Cart item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart item' });
  }
};

exports.createCartItem = async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;
    const newCartItem = await CartItem.create({ user_id, product_id, quantity });
    res.status(201).json(newCartItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create cart item' });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;
    const [updated] = await CartItem.update({ user_id, product_id, quantity }, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedCartItem = await CartItem.findByPk(req.params.id);
      res.json(updatedCartItem);
    } else {
      res.status(404).json({ error: 'Cart item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cart item' });
  }
};

exports.deleteCartItem = async (req, res) => {
  try {
    const deleted = await CartItem.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).json({ message: 'Cart item deleted' });
    } else {
      res.status(404).json({ error: 'Cart item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete cart item' });
  }
};
