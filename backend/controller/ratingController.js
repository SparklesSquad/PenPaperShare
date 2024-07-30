import Rating from './../schemas/rating.js';
import Document from '../schemas/document.js';
import User from './../schemas/user.js';

export const documentRatingController = async (req, res) => {
  try {
    const { document_id, rating } = req.body;
    const download_user_id = req.user.id;
    if (!rating || !document_id || !download_user_id) {
      return res.send(500).send('Missing data');
    }

    if (rating && rating > 5) {
      return res.send(500).send('Rating cannot be greater than 5!');
    }

    const user = await User.findById(download_user_id);

    if (!user) {
      return res.status(403).send("User doesn't exist");
    }

    const isAlreadyRated = await Rating.find({
      $and: [
        { download_user_id: download_user_id },
        { document_id: document_id },
      ],
    });

    if (isAlreadyRated.length > 0) {
      return res.status(403).send('Rating already given');
    }

    const document = await Document.findById(document_id);
    const rateDocument = new Rating({
      upload_user_id: document.user_id,
      download_user_id,
      document_id,
      rating,
    });

    await rateDocument.save();
    return res.status(200).send('Rating Updated Successfully');
  } catch (error) {
    console.log(error);
    return res.status(500).send('Error while rating');
  }
};
