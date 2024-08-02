import Upload from '../schemas/upload.js';
import Download from '../schemas/download.js';
import Rating from '../schemas/rating.js';

export const getUploadsController = async (req, res) => {
  try {
    const { user_id } = req.body;

    const uploads = await Upload.find({ user_id: user_id }).populate(
      'document_id'
    );

    return res.status(200).json({
      data: uploads,
      count: uploads.length,
      message: 'Fetched Upload count of the user successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: 0,
      message: 'Error while fetching upload count of the user',
    });
  }
};

export const getDownloadsController = async (req, res) => {
  try {
    const { user_id } = req.body;
    console.log(user_id);
    const downloads = await Download.find({
      download_user_id: user_id,
    }).populate('document_id');

    return res.status(200).json({
      data: downloads,
      count: downloads.length,
      message: 'Fetched download count of the user successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: 0,
      message: 'Error while fetching download count of the user',
    });
  }
};

export const getGivenRatingsController = async (req, res) => {
  try {
    const { user_id } = req.body;

    const ratings = await Rating.find({ download_user_id: user_id }).populate(
      'document_id'
    );

    return res.status(200).json({
      data: ratings,
      count: ratings.length,
      message: 'Fetched review count of the user successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: [],
      count: 0,
      message: 'Error while fetching review count of the user',
    });
  }
};

export const getReceivedRatingsController = async (req, res) => {
  try {
    const { user_id } = req.body;

    const ratings = await Rating.find({ upload_user_id: user_id }).populate(
      'document_id'
    );

    return res.status(200).json({
      data: ratings,
      count: ratings.length,
      message: 'Fetched review count of the user successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: [],
      count: 0,
      message: 'Error while fetching review count of the user',
    });
  }
};
