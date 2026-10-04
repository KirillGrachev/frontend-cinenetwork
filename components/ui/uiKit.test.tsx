import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SmartList from './SmartList';
import Pagination from './Pagination';
import { renderWithProviders } from '../../tests/renderWithProviders';

describe('SmartList', () => {
    it('renders a plain list below the virtualisation threshold', () => {
        const items = Array.from({ length: 5 }, (_, i) => `item-${i}`);

        render(
            <SmartList
                data={items}
                threshold={150}
                itemContent={(index, item) => <div key={index}>{item}</div>}
            />,
        );

        expect(screen.getByText('item-0')).toBeInTheDocument();
        expect(screen.getByText('item-4')).toBeInTheDocument();
    });

    it('renders nothing for an empty totalCount', () => {
        const { container } = render(
            <SmartList totalCount={0} itemContent={(index) => <div key={index}>x</div>} />,
        );
        expect(container.textContent).toBe('');
    });

    it('respects totalCount when no data array is given (windowed mode)', () => {
        render(<SmartList totalCount={3} itemContent={(index) => <div>row-{index}</div>} />);
        expect(screen.getByText('row-0')).toBeInTheDocument();
        expect(screen.getByText('row-2')).toBeInTheDocument();
        expect(screen.queryByText('row-3')).not.toBeInTheDocument();
    });
});

describe('Pagination', () => {
    /** Prev/Next are icon buttons with translated aria-labels — pick by position. */
    const navButtons = () => {
        const buttons = screen.getAllByRole('button');
        return { prev: buttons[0], next: buttons[buttons.length - 1] };
    };

    it('renders no controls when there is a single page', async () => {
        await renderWithProviders(
            <Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />,
        );
        // The provider stack (ToastContainer etc.) renders its own empty
        // shells, so assert on the pagination controls specifically.
        await waitFor(() => expect(screen.queryByRole('button')).toBeNull());
    });

    it('calls onPageChange with the target page', async () => {
        const user = userEvent.setup();
        const onPageChange = vi.fn();

        await renderWithProviders(
            <Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />,
        );

        await user.click(await screen.findByRole('button', { name: '3' }));
        expect(onPageChange).toHaveBeenCalledWith(3);
    });

    it('disables Prev on the first page and Next on the last', async () => {
        const { rerender } = await renderWithProviders(
            <Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />,
        );
        await screen.findByRole('button', { name: '1' });
        expect(navButtons().prev).toBeDisabled();

        rerender(<Pagination currentPage={5} totalPages={5} onPageChange={vi.fn()} />);
        expect(navButtons().next).toBeDisabled();
    });
});
