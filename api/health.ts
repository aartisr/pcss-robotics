export default function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
  res.status(200).json({
    status: 'ok',
    app: 'PCSS II Robotics (FTC #23548)',
    platform: 'Vercel Serverless Edge',
    time: new Date().toISOString(),
    organization: 'Pioneer Charter School of Science II',
    nonprofitStatus: '501(c)(3) Public Charity'
  });
}
