import React from 'react';
import { 
  Sparkles, 
  Users, 
  Calendar, 
  MapPin, 
  ArrowUpRight, 
  Heart, 
  Wrench, 
  GraduationCap 
} from 'lucide-react';

export const OutreachSection: React.FC = () => {
  const initiatives = [
    {
      title: 'Scrapyard Prototyping Workshops',
      category: 'Hands-On STEM Feeder',
      image: '/homecards/Scrapyard.webp',
      fallback: '/homecards/Scrapyard.png',
      description: 'Monthly weekend engineering bootcamps where Saugus middle school students design and wire motorized combat bots from recycled electronic scrap.',
      metric: '180+ Middle Schoolers Trained'
    },
    {
      title: 'Aerospace & JPL Advisory Days',
      category: 'Industry Mentorship',
      image: '/homecards/JPL.webp',
      fallback: '/homecards/JPL.png',
      description: 'Technical design reviews and autonomous code audits hosted with NASA Jet Propulsion Laboratory and aerospace flight-control mentors.',
      metric: 'Bi-Weekly CAD & Kinematics Reviews'
    },
    {
      title: 'Circuit 2026 Flagship Invitational',
      category: 'Regional Exhibition',
      image: '/homecards/Daydream.webp',
      fallback: '/homecards/Daydream.png',
      description: 'Our annual STEM symposium gathering 16 regional FTC and FLL teams, university engineering researchers, and corporate robotics sponsors in Massachusetts.',
      metric: '500+ Attendees Anticipated'
    }
  ];

  return (
    <section className="py-12 sm:py-16 space-y-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-800/40 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              NORTH SHORE STEM COMMUNITY LEADERSHIP
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Circuit 2026 & Youth Outreach Initiatives
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              At Pioneer Charter School of Science II, building robots is only half the mission. We actively mentor junior STEM students, ignite passion for mechanical engineering, and run free STEM clinics across Essex County.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300 shrink-0 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>CIRCUIT 2026 INVITATIONAL: COMING SPRING 2026</span>
          </div>
        </div>

        {/* Initiatives Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {initiatives.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden hover:border-cyan-800/60 hover:bg-slate-900 transition flex flex-col justify-between group"
            >
              <div className="relative h-48 overflow-hidden bg-slate-950">
                <picture>
                  <source srcSet={item.image} type="image/webp" />
                  <img
                    src={item.fallback}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80 group-hover:opacity-100"
                    loading="lazy"
                  />
                </picture>
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-950/90 text-[10px] font-mono text-cyan-300 border border-cyan-800/60 backdrop-blur-sm">
                  {item.category}
                </div>
              </div>

              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-cyan-400">
                  <span>{item.metric}</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Impact Numbers Card */}
        <div className="p-8 rounded-2xl border border-cyan-900/40 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 space-y-6">
          <div className="max-w-2xl space-y-2">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-cyan-400" />
              Empowering Diversity & Representation in FIRST
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              PCSS II Robotics proudly reflects an urban community where over 65% of team members identify as underrepresented minorities in STEM, and 45% of mechanical and software sub-teams are led by female student engineers.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-800">
            <div>
              <div className="text-2xl font-black text-cyan-400 font-mono">450+</div>
              <div className="text-xs text-slate-400 mt-0.5">Elementary & Middle School Students Mentored</div>
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-400 font-mono">100%</div>
              <div className="text-xs text-slate-400 mt-0.5">Senior College Matriculation to STEM Majors</div>
            </div>
            <div>
              <div className="text-2xl font-black text-purple-400 font-mono">3 Teams</div>
              <div className="text-xs text-slate-400 mt-0.5">Feeder FLL Teams Founded in Saugus, MA</div>
            </div>
            <div>
              <div className="text-2xl font-black text-amber-400 font-mono">1,200+</div>
              <div className="text-xs text-slate-400 mt-0.5">Annual Volunteer & Mentorship Hours</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
