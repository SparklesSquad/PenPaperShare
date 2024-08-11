import Rating from '../schemas/rating.js';
import Upload from '../schemas/upload.js';
import Download from '../schemas/download.js';

export const getUploadsController = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'The User Id is Invalid',
      });
    }

    const uploads = await Upload.find({ user_id: user_id }).populate(
      'document_id'
    );

    if (uploads.length === 0) {
      return res.status(200).json({
        success: true,
        data: uploads,
        count: 0,
        message: 'No uploads Found',
      });
    }

    return res.status(200).json({
      success: true,
      data: uploads,
      count: uploads.length,
      message: 'Fetched Upload count of the user successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error while fetching upload count of the user',
      error,
    });
  }
};

export const getDownloadsController = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'The User Id is Invalid',
      });
    }

    const downloads = await Download.find({
      download_user_id: user_id,
    }).populate('document_id');

    if (downloads.length === 0) {
      return res.status(200).json({
        success: true,
        data: downloads,
        count: 0,
        message: 'No downloads Found',
      });
    }

    return res.status(200).json({
      success: true,
      data: downloads,
      count: downloads.length,
      message: 'Fetched download count of the user successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error while fetching download count of the user',
      error,
    });
  }
};

export const getGivenRatingsController = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'The User Id is Invalid',
      });
    }

    const ratings = await Rating.find({ download_user_id: user_id }).populate(
      'document_id'
    );

    if (ratings.length === 0) {
      return res.status(200).json({
        success: true,
        data: ratings,
        count: 0,
        message: 'No downloads Found',
      });
    }

    return res.status(200).json({
      success: true,
      data: ratings,
      count: ratings.length,
      message: 'Fetched reviews and Review Count of the user successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error while fetching review count of the user',
      error,
    });
  }
};

export const getReceivedRatingsController = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'The User Id is Invalid',
      });
    }

    const ratings = await Rating.find({ upload_user_id: user_id }).populate(
      'document_id'
    );

    if (ratings.length === 0) {
      return res.status(200).json({
        success: true,
        data: ratings,
        count: 0,
        message: 'No Ratings Found',
      });
    }

    return res.status(200).json({
      success: true,
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
