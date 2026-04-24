import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'motion/react';
import { Button } from '../components/ui/Button';
import { GradientText } from '../components/ui/GradientText';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Footer } from '../components/layout/Footer';
import { IdentityBanner } from '../components/portal/IdentityBanner';

const ease = [0.25, 1, 0.5, 1] as const;

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: 0.1 + i * 0.08, ease },
  }),
};

export function LandingPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [rememberDevice, setRememberDevice] = useState(false);

  const handleAuthenticate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void navigate('/secure');
  };

  return (
    <div className="min-h-screen mesh-gradient flex flex-col">
      <main className="flex-grow flex items-center justify-center p-6 md:p-12">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-[480px]"
        >
          <Card className="p-8">
            <motion.div
              custom={0}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-3 mb-6"
            >
              <span
                className="material-symbols-outlined text-[#FF6633] text-[32px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                shield_lock
              </span>
              <span className="text-base font-bold text-[#e5e2e3] tracking-wide">NeuralGate</span>
            </motion.div>

            <motion.div
              custom={1}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="mb-6"
            >
              <h1 className="text-2xl font-bold leading-tight mb-2">
                <GradientText
                  colors={['#FF6633', '#ff8c00', '#ffb59e', '#ff8c00', '#FF6633']}
                  animationSpeed={4}
                  className="!mx-0 !rounded-none text-2xl font-bold"
                >
                  Secure access for your entire workforce
                </GradientText>
              </h1>
              <p className="text-sm text-[#9ca3af]">
                Verify identity. Protect applications. Defend your data.
              </p>
            </motion.div>

            <motion.div
              custom={2}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="mb-6"
            >
              <IdentityBanner variant="card" />
            </motion.div>

            <motion.form
              onSubmit={handleAuthenticate}
              custom={3}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <Input
                id="password"
                label="Enterprise Password"
                type="password"
                placeholder="Enter your enterprise password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                }
                autoComplete="current-password"
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="w-3.5 h-3.5 accent-[#FF6633] rounded"
                  />
                  <span className="text-xs text-[#9ca3af]">Remember device</span>
                </label>
                <a
                  href="#"
                  className="text-xs text-[#FF6633] hover:opacity-80 transition-opacity"
                >
                  Forgot password?
                </a>
              </div>

              <Button type="submit" className="w-full !py-3 !text-base mt-2">
                Authenticate
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </Button>
            </motion.form>

            <motion.div
              custom={4}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="mt-6 pt-5 border-t border-white/[0.06] flex items-center justify-center gap-2"
            >
              <span
                className="material-symbols-outlined text-[#9ca3af] text-[16px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified_user
              </span>
              <p className="text-[10px] font-semibold text-[#9ca3af] tracking-widest uppercase">
                Protected by Cloudflare Zero Trust
              </p>
            </motion.div>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
