import Address from '../models/Address.js';

// GET /api/address — get all addresses for logged-in user
export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch addresses' });
  }
};

// POST /api/address — add a new address
export const addAddress = async (req, res) => {
  try {
    const { fullName, phone, street, city, state, pincode, isDefault } = req.body;

    // If new address is default, unset all others
    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const address = await Address.create({
      user: req.user._id,
      fullName, phone, street, city, state, pincode, isDefault: isDefault || false,
    });

    res.status(201).json(address);
  } catch (err) {
    res.status(500).json({ message: 'Failed to save address' });
  }
};

// PUT /api/address/:id — update an address
export const updateAddress = async (req, res) => {
  try {
    const { isDefault } = req.body;
    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }
    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!address) return res.status(404).json({ message: 'Address not found' });
    res.json(address);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update address' });
  }
};

// DELETE /api/address/:id — delete an address
export const deleteAddress = async (req, res) => {
  try {
    await Address.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: 'Address deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete address' });
  }
};
