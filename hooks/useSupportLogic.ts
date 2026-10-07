
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getSupportTopics } from '../constants';
import { useLocale } from '../context/LocaleContext';
import { useToast } from '../context/ToastContext';
import { AttachmentType, ToastType } from '../types';
import { createSupportSchema, SupportFormValues } from '../utils/validationSchemas';

export const useSupportLogic = () => {
  const { t } = useLocale();
  const { showToast } = useToast();
  const SUPPORT_TOPICS = getSupportTopics(t);
  const [isDragOver, setIsDragOver] = useState(false); 
  const [isLoading, setIsLoading] = useState(true); 
  React.useEffect(() => { const timer = setTimeout(() => { setIsLoading(false); }, 500); return () => clearTimeout(timer); }, []);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const schema = createSupportSchema(t);

  const {
      register,
      handleSubmit,
      setValue,
      watch,
      reset,
      formState: { errors, isSubmitting }
  } = useForm<SupportFormValues>({
      resolver: zodResolver(schema),
      mode: 'onSubmit',
      reValidateMode: 'onSubmit',
      defaultValues: {
          topic: SUPPORT_TOPICS[0]?.id || 'other',
          name: '',
          email: '',
          subject: '',
          message: '',
          attachmentType: AttachmentType.File,
          link: ''
      }
  });

  const attachmentType = watch('attachmentType');
  const currentTopic = watch('topic');
  const name = watch('name');
  const email = watch('email');
  const subject = watch('subject');
  const message = watch('message');
  const link = watch('link');

  const hasUnsavedChanges = Boolean(
      (name && name.trim().length > 0) ||
      (email && email.trim().length > 0) ||
      (subject && subject.trim().length > 0) ||
      (message && message.trim().length > 0) ||
      (link && link.trim().length > 0) ||
      selectedFiles.length > 0
  );

  const onSubmit = async (data: SupportFormValues) => {
      // Simulate API
      await new Promise(resolve => setTimeout(resolve, 1000));
      showToast(t('support.ticketSuccess'), ToastType.Success);
      reset({
          topic: SUPPORT_TOPICS[0]?.id || 'other',
          attachmentType: AttachmentType.File,
          name: '',
          email: '',
          subject: '',
          message: '',
          link: ''
      });
      setSelectedFiles([]);
  };

  const actions = {
      setTopic: (id: string) => setValue('topic', id, { shouldValidate: false }),
      setAttachmentType: (type: AttachmentType) => setValue('attachmentType', type, { shouldValidate: false }),
      setDragOver: (dragState: boolean) => setIsDragOver(dragState),
      setSelectedFiles,
      submit: handleSubmit(onSubmit),
      resetForm: () => {
          reset({
              topic: SUPPORT_TOPICS[0]?.id || 'other',
              attachmentType: AttachmentType.File,
              name: '',
              email: '',
              subject: '',
              message: '',
              link: ''
          });
          setSelectedFiles([]);
      }
  };

  return {
      state: {
          errors,
          topics: SUPPORT_TOPICS,
          isDragOver,
          isSubmitting, isLoading,
          attachmentType,
          currentTopic,
          hasUnsavedChanges,
          selectedFiles
      },
      register, // Expose RHF register
      actions
  };
};
