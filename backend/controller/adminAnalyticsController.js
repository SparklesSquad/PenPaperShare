import Upload from '../schemas/upload.js';
import Download from '../schemas/download.js';
import User from '../schemas/user.js';
import Rating from '../schemas/rating.js';

export const getTopFiveDownloadedDocumentsController = async (req, res) => {
  try {
    //To get top 5 documents based on id
    const topFiveDocumentsQuery = Download.aggregate([
      {
        $lookup: {
          from: 'Document',
          localField: 'document_id',
          foreignField: '_id',
          as: 'documentDetails',
        },
      },
      {
        $unwind: '$documentDetails',
      },
      {
        $group: {
          _id: '$document_id',
          downloadCount: { $sum: 1 },
          documentDetails: { $first: '$documentDetails' },
        },
      },
      {
        $project: {
          _id: 0,
          document: '$documentDetails.title',
          downloadCount: 1,
        },
      },
      {
        $sort: { downloadCount: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    //To get the top 5 subjects
    const topFiveSubjectsQuery = Download.aggregate([
      {
        $lookup: {
          from: 'Document',
          localField: 'document_id',
          foreignField: '_id',
          as: 'subjectDetails',
        },
      },
      {
        $unwind: '$subjectDetails',
      },
      {
        $group: {
          _id: '$subjectDetails.subject',
          subjectCount: { $sum: 1 },
          subjectDetails: { $first: '$subjectDetails' },
        },
      },
      {
        $project: {
          _id: 0,
          subject: '$_id',
          subjectCount: 1,
        },
      },
      {
        $sort: { subjectCount: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    //To get top 5 Uploaders
    const topFiveUplodersQuery = Upload.aggregate([
      {
        $lookup: {
          from: 'User',
          localField: 'user_id',
          foreignField: '_id',
          as: 'uploadDetails',
        },
      },
      {
        $unwind: '$uploadDetails',
      },
      {
        $group: {
          _id: '$user_id',
          uploadCount: { $sum: 1 },
          uploadDetails: { $first: '$uploadDetails' },
        },
      },
      {
        $project: {
          _id: 0,
          user: '$uploadDetails.username',
          uploadCount: 1,
        },
      },
      {
        $sort: { uploadCount: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    // Run both queries in parallel
    const [topFiveDocuments, topFiveSubjects, topFiveUploaders] =
      await Promise.all([
        topFiveDocumentsQuery,
        topFiveSubjectsQuery,
        topFiveUplodersQuery,
      ]);

    return res.status(200).json({
      success: true,
      data: { topFiveDocuments, topFiveSubjects, topFiveUploaders },
      message: 'Successfully fetched top 5 documents',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
      message: 'Error while fetching top 5 documents',
    });
  }
};

export const getUsersGrowthControlller = async (req, res) => {
  try {
    const { year } = req.query; // Get the year from query parameters

    // Validate the year parameter
    if (
      !year ||
      isNaN(year) ||
      year < 2024 ||
      year > new Date().getFullYear()
    ) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid year provided' });
    }

    const startDate = new Date(`${year}-01-01T00:00:00Z`);
    const endDate = new Date(`${year}-12-31T23:59:59Z`);

    const userGrowthData = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          userCount: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }, // Sort by year and month
      },
    ]);

    const formattedData = userGrowthData.map((entry) => ({
      month: `${entry._id.year}-${String(entry._id.month).padStart(2, '0')}`, // Format YYYY-MM
      userCount: entry.userCount,
    }));

    return res.status(200).json({
      success: true,
      data: formattedData,
      message: 'Successfully fetched user growth data for the selected year',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error while fetching user growth data',
      error,
    });
  }
};

// Analytics
// For Admin Dashboard
export const getTotalCountsController = async (req, res) => {
  try {
    // total users
    const usersQuery = User.countDocuments();
    const docsQuery = Document.countDocuments();
    const ratingsQuery = Rating.countDocuments();
    const downloadsQuery = Download.countDocuments();
    const pendingQuery = Document.countDocuments({ approved: 'APPROVED' });

    const [users, docs, ratings, downloads, pending] = await Promise.all([
      usersQuery,
      docsQuery,
      ratingsQuery,
      downloadsQuery,
      pendingQuery,
    ]);

    return res.status(200).json({
      success: true,
      data: [users, docs, ratings, downloads, pending],
      message: 'All analytics Fetched Successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error while fetching the analytics',
      error,
    });
  }
};
