import { AnimatePresence, motion, MotionConfig } from "framer-motion";

import dogFace from "@/assets/img/brand/dog-face.webp";
import { useSettingStore } from "@/store/settingStore";

const DARK_MODE_IMAGE_FIX = "[filter:invert(1)_hue-rotate(180deg)]";

type Props = {
  isOpen: boolean;
  questions: string[];
};

export function DraftAdviceBubble({ isOpen, questions }: Props) {
  const darkMode = useSettingStore((state) => state.darkMode);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="flex items-start gap-2 pt-1">
              <img
                src={dogFace}
                alt=""
                className={`h-8 w-8 shrink-0 rounded-full bg-brand-soft object-cover ${
                  darkMode ? DARK_MODE_IMAGE_FIX : ""
                }`}
              />
              <div className="flex flex-col gap-1 rounded-2xl rounded-tl-sm bg-brand-tint px-3 py-2">
                {questions.map((question) => (
                  <p key={question} className="break-keep text-sm text-ink">
                    {question}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
