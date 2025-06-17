// @ts-nocheck
import connectDB from '../db/mongodb';
import Region from '../models/Region';
import Department from '../models/Department';
import { HomeData } from '../types/region';

const SELECTED_REGIONS = [
  '11', '24', '27', '28', '32', '44', '52', '53', '75',
  '76', '84', '93', '94', 'COM', '01', '02', '03', '04', '06'
];

export async function getHomeData(): Promise<HomeData> {
  try {
    await connectDB();

    // Fetch regions
    const regions = await Region.find({
      code: { $in: SELECTED_REGIONS }
    }).lean();

    // Fetch departments with region info
    const departments = await Department.aggregate([
      {
        $lookup: {
          from: 'regions',
          localField: 'region_code',
          foreignField: 'code',
          as: 'region_info'
        }
      },
      {
        $unwind: '$region_info'
      },
      {
        $project: {
          code: 1,
          name: 1,
          region: '$region_info.name',
          dpt_slug: '$slug',
          region_slug: '$region_info.slug',
          region_code: '$region_code'
        }
      }
    ]);

    return {
      regions,
      departments
    };
  } catch (error) {
    console.error('Error fetching home data:', error);
    return {
      regions: [],
      departments: []
    };
  }
}
