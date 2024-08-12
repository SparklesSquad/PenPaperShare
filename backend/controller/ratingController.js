import Rating from './../schemas/rating.js';
import Document from '../schemas/document.js';
import User from './../schemas/user.js';

export const documentRatingController = async (req, res) => {
  try {
    const { id } = req.query;
    const { rating } = req.body;
    const download_user_id = req.user.id;

    if (!rating || !id || !download_user_id) {
      return res.send(500).json({ success: false, message: 'Missing data' });
    }

    if (rating && rating > 5) {
      return res
        .send(400)
        .json({ success: false, message: 'Rating cannot be greater than 5!' });
    }

    const user = await User.findById(download_user_id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User Doesnt exist' });
    }

    const isAlreadyRated = await Rating.find({
      $and: [{ download_user_id: download_user_id }, { document_id: id }],
    });

    if (isAlreadyRated.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: 'Rating already given' });
    }

    const document = await Document.findById(id);

    if (!document) {
      return res
        .status(400)
        .json({ success: false, message: 'No document found to rate' });
    }
    const rateDocument = new Rating({
      upload_user_id: document.user_id,
      download_user_id,
      id,
      rating,
    });

    await rateDocument.save();
    return res.status(200).json({
      success: true,
      message: 'Rating Updated Successfully',
      data: document,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: 'Error while rating', error });
  }
};
