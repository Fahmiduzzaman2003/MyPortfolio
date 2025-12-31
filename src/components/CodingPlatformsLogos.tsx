import { motion } from "framer-motion";

// Competitive programming platform SVG icons
export const platformIcons: Record<string, JSX.Element> = {
  leetcode: (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
    </svg>
  ),
  codeforces: (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
      <path d="M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5h-3C.672 21 0 20.328 0 19.5V9c0-.828.672-1.5 1.5-1.5h3zm9-4.5c.828 0 1.5.672 1.5 1.5v15c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5v-15c0-.828.672-1.5 1.5-1.5h3zm9 7.5c.828 0 1.5.672 1.5 1.5v7.5c0 .828-.672 1.5-1.5 1.5h-3c-.828 0-1.5-.672-1.5-1.5V12c0-.828.672-1.5 1.5-1.5h3z" />
    </svg>
  ),
  codechef: (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
      <path d="M11.007.22C5.235.718.756 5.292.306 11.069c-.45 5.776 3.322 10.92 8.686 12.18.128-.21.321-.62.415-.886.095-.267.152-.563.152-.563s-.09-.022-.256-.045c-.323-.046-.765-.129-1.127-.283-.217-.092-.39-.205-.39-.205l-.06-.03.046-.067c.227-.315.44-.593.665-.955l.083-.139-.149-.053c-.266-.093-.67-.238-1.021-.44-.496-.284-.941-.68-1.314-1.14-.403-.5-.735-1.074-.957-1.695-.328-.923-.49-1.92-.501-2.935-.01-.907.11-1.823.323-2.71a10.09 10.09 0 011.2-3.054 8.442 8.442 0 011.69-2.103c.31-.284.637-.545.978-.78.284-.195.578-.37.882-.523.608-.304 1.253-.536 1.916-.693a9.55 9.55 0 011.964-.296c.326-.012.656.004.98.05.258.038.513.097.765.168a5.79 5.79 0 011.495.584c.268.155.52.333.755.532.468.398.886.859 1.252 1.372a8.29 8.29 0 011.05 2.045c.208.536.372 1.093.488 1.662.09.441.14.889.162 1.34.023.48-.003.967-.075 1.447a7.398 7.398 0 01-.464 1.763c-.105.268-.223.532-.358.787-.27.512-.6.994-.99 1.43a6.45 6.45 0 01-1.15 1.045c-.403.287-.842.528-1.305.716l-.135.055.094.127c.203.275.38.541.506.824.108.243.175.5.24.756.066.26.108.527.155.793l.033.19.179-.057c.666-.215 1.29-.55 1.845-.978a7.15 7.15 0 001.408-1.494c.399-.545.728-1.137.976-1.764a9.81 9.81 0 00.568-2.044c.11-.571.177-1.153.186-1.737a9.93 9.93 0 00-.096-1.756c-.086-.536-.213-1.065-.37-1.582a10.21 10.21 0 00-.99-2.336 9.502 9.502 0 00-1.71-2.252A8.447 8.447 0 0016.98 1.16 8.42 8.42 0 0014.61.278 9.698 9.698 0 0011.007.22z" />
    </svg>
  ),
  hackerrank: (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
      <path d="M12 0c1.285 0 9.75 4.886 10.392 6 .645 1.115.645 10.885 0 12S13.287 24 12 24s-9.75-4.885-10.395-6c-.641-1.115-.641-10.885 0-12C2.25 4.886 10.715 0 12 0zm2.295 6.799c-.141 0-.258.115-.258.258v3.875H9.963V6.908h.701c.141 0 .254-.115.254-.258 0-.094-.049-.176-.123-.221L9.223 4.992c-.066-.043-.105-.07-.164-.07-.059 0-.121.027-.186.07L7.3 6.429c-.074.045-.12.131-.12.221 0 .143.113.258.258.258h.699v10.035h-.699c-.145 0-.258.115-.258.254 0 .094.045.181.12.227l1.57 1.436c.066.043.127.07.186.07.059 0 .098-.027.164-.07l1.572-1.436c.074-.045.123-.133.123-.227 0-.139-.113-.254-.254-.254h-.701V13.07h4.074v3.893h-.699c-.143 0-.258.115-.258.254 0 .094.049.181.123.227l1.572 1.436c.066.043.105.07.164.07.059 0 .121-.027.186-.07l1.573-1.436c.074-.045.117-.133.117-.227 0-.139-.111-.254-.254-.254h-.7V6.908h.7c.142 0 .254-.115.254-.258 0-.094-.043-.176-.117-.221l-1.573-1.437c-.065-.043-.127-.07-.186-.07-.059 0-.098.027-.164.07L14.053 6.43c-.074.045-.123.127-.123.221 0 .143.115.258.258.258l.107-.11z" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
  ),
};

export const platformColors: Record<string, string> = {
  leetcode: "#FFA116",
  codeforces: "#1F8ACB",
  codechef: "#5B4638",
  hackerrank: "#2EC866",
  code: "#10B981",
};

interface CodingPlatform {
  id: string;
  name: string;
  icon_name: string;
  url: string | null;
  problems_solved: number | null;
  rating: string | null;
  username: string | null;
}

interface CodingPlatformStatsProps {
  platforms: CodingPlatform[];
}

export const CodingPlatformStats = ({ platforms }: CodingPlatformStatsProps) => {
  const totalProblems = platforms.reduce(
    (sum, p) => sum + (p.problems_solved || 0),
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative bg-gradient-to-br from-card via-card to-card/80 border border-primary/40 rounded-2xl p-8 overflow-hidden group shadow-[0_0_15px_rgba(20,184,166,0.3)]"
    >
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      
      <div className="relative z-10">
        {/* Header with Icon */}
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            </div>
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Competitive Programming
            </span>
          </h4>
          <motion.div
            animate={{ rotate: [0, 5, 0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-2xl"
          >
            🏆
          </motion.div>
        </div>

        {/* Total Stats - Enhanced */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-xl p-6 mb-6 text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer" />
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
            className="text-6xl font-extrabold bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent drop-shadow-lg"
          >
            {totalProblems}+
          </motion.div>
          <div className="text-sm font-medium text-muted-foreground mt-2 uppercase tracking-wider">
            Problems Solved Across Platforms
          </div>
        </motion.div>

        {/* Platform Cards - Enhanced */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {platforms.map((platform, index) => {
            const icon = platformIcons[platform.icon_name] || platformIcons.code;
            const color = platformColors[platform.icon_name] || platformColors.code;

            return (
              <motion.a
                key={platform.id}
                href={platform.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + index * 0.1, type: "spring" }}
                whileHover={{ scale: 1.05, y: -8 }}
                whileTap={{ scale: 0.95 }}
                className="relative group/card bg-gradient-to-br from-secondary/80 to-secondary/40 border border-border/50 rounded-xl p-4 cursor-pointer overflow-hidden shadow-md hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
              >
                {/* Glow on hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 blur-xl"
                  style={{ background: `radial-gradient(circle at center, ${color}20, transparent)` }}
                />
                
                {/* Content */}
                <div className="relative z-10 flex flex-col items-center gap-3">
                  {/* Icon with animated border */}
                  <div className="relative">
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 opacity-0 group-hover/card:opacity-100"
                      style={{ borderColor: color }}
                      animate={{ scale: [1, 1.2, 1], opacity: [0, 0.5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div
                      className="w-14 h-14 flex items-center justify-center rounded-full bg-card/50 backdrop-blur-sm border border-border/30 transition-all duration-300 group-hover/card:border-primary/30 group-hover/card:shadow-lg"
                      style={{ 
                        boxShadow: `0 0 20px ${color}30`,
                        color 
                      }}
                    >
                      <div className="w-8 h-8 transition-transform duration-300 group-hover/card:scale-110">
                        {icon}
                      </div>
                    </div>
                  </div>
                  
                  {/* Platform Info */}
                  <div className="text-center space-y-1">
                    <div className="text-sm font-bold text-foreground group-hover/card:text-primary transition-colors">
                      {platform.name}
                    </div>
                    <div className="flex items-center justify-center gap-1 text-xs font-medium">
                      <span className="text-muted-foreground">Solved:</span>
                      <span 
                        className="font-bold"
                        style={{ color }}
                      >
                        {platform.problems_solved || 0}
                      </span>
                    </div>
                    {platform.rating && (
                      <div className="flex items-center justify-center gap-1 px-2 py-1 rounded-md bg-primary/10 border border-primary/20">
                        <span className="text-[10px] text-muted-foreground">Rating:</span>
                        <span className="text-xs font-bold text-primary font-mono">
                          {platform.rating}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Corner accent */}
                <div 
                  className="absolute top-0 right-0 w-16 h-16 opacity-20 group-hover/card:opacity-40 transition-opacity"
                  style={{ 
                    background: `radial-gradient(circle at top right, ${color}, transparent)` 
                  }}
                />
              </motion.a>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default CodingPlatformStats;
