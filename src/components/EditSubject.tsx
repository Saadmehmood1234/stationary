import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { X, Save, Edit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface ContactFormData {
  _id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactDocument extends ContactFormData {
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

interface EditSubjectProps {
  handleUpdate: (id: string, updates: Partial<ContactDocument>) => void;
  subject: string;
  contactId: string;
  isOpen: boolean;
  onClose: () => void;
}

const EditSubject = ({
  handleUpdate,
  subject,
  contactId,
  isOpen,
  onClose,
}: EditSubjectProps) => {
  const [subjectData, setSubjectData] = useState(subject);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSubjectData(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (subjectData && subjectData.trim() !== "" && subjectData !== subject) {
      setIsSubmitting(true);
      try {
        await handleUpdate(contactId, {
          subject: subjectData,
        });
        onClose();
      } catch (error) {
        console.error("Error updating subject:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCancel = () => {
    setSubjectData(subject);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
              <div className="h-1 bg-gradient-to-r from-yellow-400 to-[#D5D502]" />
              
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-white via-[#D5D502] to-blue-200 bg-clip-text text-transparent flex items-center gap-2">
                    <Edit className="h-5 w-5" />
                    Edit Subject
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCancel}
                    className="h-8 w-8 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="pb-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="subject" className="text-gray-300 text-sm font-medium">
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      value={subjectData}
                      onChange={handleInputChange}
                      name="subject"
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-[#D5D502]/50 focus:border-transparent transition-all"
                      placeholder="Enter new subject..."
                      autoFocus
                    />
                    <p className="text-xs text-gray-400">
                      Current subject: "{subject}"
                    </p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      className="flex-1 cursor-pointer border-white/20 bg-gray-700 text-gray-300 hover:bg-white/10 hover:text-white rounded-full transition-colors"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={!subjectData.trim() || subjectData === subject || isSubmitting}
                      className="flex-1 cursor-pointer bg-gradient-to-r from-[#D5D502] to-yellow-500 hover:from-[#c4c401] hover:to-yellow-600 text-gray-900 border-0 rounded-full font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-900 border-t-transparent" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditSubject;