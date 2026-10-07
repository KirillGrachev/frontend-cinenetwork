
import React, { useState, useEffect } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogTitle } from '@headlessui/react';
import BaseModal from '../../ui/BaseModal';
import Button from '../../ui/Button';
import TextArea from '../../ui/TextArea';
import { Comment, TicketMessage } from '../../../hooks/useAdminComments';
import { useLocale } from '../../../context/LocaleContext';
import { CommentStatus } from '../../../types';
import { createTicketReplySchema, TicketReplyFormValues } from '../../../utils/validationSchemas';

interface TicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    ticket: Comment | null;
    onUpdate: (ticket: Comment) => void;
}

const TicketModal: React.FC<TicketModalProps> = ({ isOpen, onClose, ticket, onUpdate }) => {
    const { t } = useLocale();
    const [messages, setMessages] = useState<TicketMessage[]>([]);

    const schema = createTicketReplySchema(t);
    const {
        register,
        handleSubmit,
        reset,
        formState: { isValid }
    } = useForm<TicketReplyFormValues>({
        resolver: zodResolver(schema),
        defaultValues: { content: '' },
        mode: 'onChange'
    });

    useEffect(() => {
        if (isOpen && ticket) {
            setMessages(ticket.messages || []);
            reset(); // Clear input when opening different ticket
        }
    }, [isOpen, ticket, reset]);

    if (!ticket) return null;

    const onSend = (data: TicketReplyFormValues) => {
        const newMessage: TicketMessage = {
            id: Date.now().toString(),
            sender: 'admin',
            content: data.content,
            timestamp: t('time.justNow')
        };

        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        
        // Update the ticket object in parent state
        onUpdate({
            ...ticket,
            messages: updatedMessages,
            status: CommentStatus.Pending // Keeping it open/pending on reply
        });

        reset();
    };

    const handleStatusChange = () => {
        const newStatus = ticket.status === CommentStatus.Approved ? CommentStatus.Pending : CommentStatus.Approved;
        
        // Update parent state only, keep modal open
        onUpdate({
            ...ticket,
            status: newStatus
        });
    };

    const isClosed = ticket.status === CommentStatus.Approved; // Reuse "Approved" as "Resolved/Closed" for tickets

    return (
        <BaseModal 
            isOpen={isOpen} 
            onClose={onClose}
            className="bg-panel-primary border border-border-medium rounded-3xl max-w-2xl h-[80vh] flex flex-col shadow-2xl overflow-hidden relative"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border-light bg-panel-secondary flex-shrink-0 -mx-4 -mt-4 sm:-mx-8 sm:-mt-8 mb-0 rounded-t-3xl">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-item-primary flex items-center justify-center text-gray-500 font-bold ">
                        {ticket.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                        {/* Accessible Title */}
                        <DialogTitle as="h3" className="font-bold text-white text-lg">
                            {ticket.username}
                        </DialogTitle>
                        <div className="flex items-center gap-2 text-xs">
                            <span className={`w-2 h-2 rounded-full ${isClosed ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                            <span className="text-gray-400 font-medium">
                                {isClosed ? t('admin.comments.ticket.statusClosed') : t('admin.comments.ticket.statusOpen')}
                            </span>
                            <span className="text-gray-600">•</span>
                            <span className="text-gray-500">{t(ticket.animeTitle)}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={handleStatusChange}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                            isClosed 
                            ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500 hover:text-black' 
                            : 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500 hover:text-black'
                        }`}
                    >
                        {isClosed ? t('admin.comments.ticket.reopenTicket') : t('admin.comments.ticket.closeTicket')}
                    </button>
                    <button 
                        onClick={onClose}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <i className="fa-solid fa-xmark text-lg"></i>
                    </button>
                </div>
            </div>

            {/* Chat Area - Virtualized */}
            <div className="flex-1 min-h-0 bg-panel-primary -mx-4 sm:-mx-8">
                <Virtuoso
                    style={{ height: '100%' }}
                    data={messages}
                    followOutput="auto"
                    className="custom-scrollbar px-6"
                    components={{
                        Header: () => (
                            <div className="flex justify-center mb-6 mt-6">
                                <span className="text-[10px] bg-white/5 px-3 py-1 rounded-full text-gray-500 font-bold uppercase tracking-wider border border-white/5">
                                    {t('admin.comments.ticket.context')}: {t(ticket.animeTitle)}
                                </span>
                            </div>
                        ),
                        Footer: () => <div className="pb-6" /> // Padding at bottom
                    }}
                    itemContent={(index, msg) => {
                        const isAdmin = msg.sender === 'admin';
                        return (
                            <div className={`flex ${isAdmin ? 'justify-end' : 'justify-start'} mb-4`}>
                                <div className={`max-w-[80%] ${isAdmin ? 'order-1' : 'order-2'}`}>
                                    <div className={`p-4 rounded-2xl text-sm leading-relaxed border ${
                                        isAdmin 
                                        ? 'bg-blue-600 text-white border-blue-500 rounded-tr-sm shadow-[0_4px_15px_rgba(37,99,235,0.2)]' 
                                        : 'bg-panel-secondary text-gray-200 border-border-light rounded-tl-sm'
                                    }`}>
                                        {msg.content}
                                    </div>
                                    <div className={`text-[10px] text-gray-600 mt-1.5 font-medium ${isAdmin ? 'text-right' : 'text-left'}`}>
                                        {isAdmin ? t('admin.comments.ticket.adminRole') : ticket.username} • {msg.timestamp}
                                    </div>
                                </div>
                            </div>
                        );
                    }}
                />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-panel-secondary border-t border-border-light flex-shrink-0 -mx-4 -mb-4 sm:-mx-8 sm:-mb-8 rounded-b-3xl">
                <form onSubmit={handleSubmit(onSend)} className="flex items-center gap-3 bg-item-primary rounded-2xl p-2  transition-colors">
                    <TextArea 
                        {...register('content')}
                        placeholder={t('admin.comments.ticket.replyPlaceholder')}
                        className="bg-transparent border-none focus:bg-transparent min-h-[44px] max-h-[150px] py-2.5 px-2 flex-1 resize-none !rounded-none"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(onSend)();
                            }
                        }}
                    />
                    <button 
                        type="submit"
                        disabled={!isValid}
                        className={`w-8 h-8 rounded-xl mr-1 flex-shrink-0 flex items-center justify-center transition-all ${
                            isValid 
                            ? 'bg-white text-black shadow-md hover:scale-105' 
                            : 'bg-white/5 text-gray-600 cursor-not-allowed'
                        }`}
                    >
                        <i className="fa-solid fa-paper-plane text-xs"></i>
                    </button>
                </form>
            </div>
        </BaseModal>
    );
};

export default TicketModal;
