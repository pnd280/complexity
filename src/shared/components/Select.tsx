import {
  ButtonHTMLAttributes,
  Children,
  createContext,
  forwardRef,
  HTMLAttributes,
  isValidElement,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  cva,
  VariantProps,
} from 'class-variance-authority';

import { cn } from '@/utils/shadcn-ui-utils';
import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingList,
  FloatingPortal,
  offset,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListItem,
  useListNavigation,
  useMergeRefs,
  useRole,
  useTypeahead,
} from '@floating-ui/react';

type SelectContextValue = {
  activeIndex: number | null;
  selectedIndex: number | null;
  selectedValue: string | null;
  getItemProps: ReturnType<typeof useInteractions>['getItemProps'];
  handleSelect: (index: number | null, value: string | null) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean | ((prevState: boolean) => boolean)) => void;
  registerOption: (value: string) => void;
};

const SelectContext = createContext<SelectContextValue>(
  {} as SelectContextValue
);

type SelectProps = {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  value?: string;
  onValueChange?: (value: string) => void;
  onPointerDownOutside?: (event: Event) => void;
};

export function Select({
  children,
  open: controlledOpen,
  onOpenChange,
  value: controlledValue,
  onValueChange,
  onPointerDownOutside,
}: SelectProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState<string | null>(
    null
  );
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [options, setOptions] = useState<string[]>([]);

  const isOpen =
    controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const selectedValue =
    controlledValue !== undefined ? controlledValue : uncontrolledValue;

  const setIsOpen = useCallback(
    (open: boolean | ((prevState: boolean) => boolean)) => {
      const newOpenState = typeof open === 'function' ? open(isOpen) : open;
      if (controlledOpen === undefined) {
        setUncontrolledOpen(newOpenState);
      }
      if (onOpenChange) {
        onOpenChange(newOpenState);
      }
      if (newOpenState) {
        setActiveIndex(selectedIndex);
      }
    },
    [controlledOpen, onOpenChange, isOpen, selectedIndex]
  );

  const setSelectedValue = useCallback(
    (value: string | null) => {
      if (controlledValue === undefined) {
        setUncontrolledValue(value);
      }
      if (onValueChange && value !== null) {
        onValueChange(value);
      }
    },
    [controlledValue, onValueChange]
  );

  const registerOption = useCallback((value: string) => {
    setOptions((prev) => [...prev, value]);
  }, []);

  useEffect(() => {
    if (controlledValue !== undefined) {
      const index = options.indexOf(controlledValue);
      setSelectedIndex(index !== -1 ? index : null);
      setActiveIndex(index !== -1 ? index : null);
    }
  }, [controlledValue, options]);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({
        fallbackAxisSideDirection: 'end',
      }),
    ],
    placement: 'bottom-start',
  });

  const elementsRef = useRef<(HTMLElement | null)[]>([]);
  const labelsRef = useRef<(string | null)[]>([]);

  const handleSelect = useCallback(
    (index: number | null, value: string | null) => {
      setSelectedIndex(index);
      setSelectedValue(value);
      setActiveIndex(index);
      setIsOpen(false);
    },
    [setIsOpen, setSelectedValue]
  );

  const handleTypeaheadMatch = (index: number | null) => {
    if (isOpen) {
      setActiveIndex(index);
    } else {
      handleSelect(index, options[index!] || null);
    }
  };

  const listNav = useListNavigation(context, {
    listRef: elementsRef,
    activeIndex,
    selectedIndex,
    onNavigate: setActiveIndex,
    loop: true,
  });

  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    activeIndex,
    selectedIndex,
    onMatch: handleTypeaheadMatch,
  });

  const dismiss = useDismiss(context, {
    outsidePress: (event) => {
      if (onPointerDownOutside) {
        onPointerDownOutside(event);
      }
      return true;
    },
  });

  const click = useClick(context);

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [click, useRole(context, { role: 'listbox' }), dismiss, listNav, typeahead]
  );

  const selectContext = useMemo(
    () => ({
      activeIndex,
      selectedIndex,
      selectedValue,
      getItemProps,
      handleSelect,
      isOpen,
      setIsOpen,
      registerOption,
    }),
    [
      activeIndex,
      selectedIndex,
      selectedValue,
      getItemProps,
      handleSelect,
      isOpen,
      setIsOpen,
      registerOption,
    ]
  );

  return (
    <SelectContext.Provider value={selectContext}>
      <div ref={refs.setReference} {...getReferenceProps()}>
        {Children.toArray(children).find(
          (child) => isValidElement(child) && child.type === SelectTrigger
        )}
      </div>
      <FloatingPortal>
        {isOpen && (
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
              className="tw-z-50"
            >
              <div className="tw-relative tw-min-w-[8rem] tw-rounded-md">
                <div
                  className={cn(
                    'tw-rounded-md tw-border tw-bg-popover tw-text-popover-foreground tw-shadow-md tw-overflow-auto custom-scrollbar',
                    'data-[state=open]:tw-animate-in data-[state=closed]:tw-animate-out',
                    'data-[state=closed]:tw-fade-out-0 data-[state=open]:tw-fade-in-0',
                    'data-[state=closed]:tw-zoom-out-95 data-[state=open]:tw-zoom-in-95',
                    'data-[side=bottom]:tw-slide-in-from-top-2 data-[side=left]:tw-slide-in-from-right-2',
                    'data-[side=right]:tw-slide-in-from-left-2 data-[side=top]:tw-slide-in-from-bottom-2'
                  )}
                  data-state={isOpen ? 'open' : 'closed'}
                  data-side={context.placement}
                >
                  <div className={cn('tw-max-h-96')}>
                    <FloatingList
                      elementsRef={elementsRef}
                      labelsRef={labelsRef}
                    >
                      {Children.toArray(children).find(
                        (child) =>
                          isValidElement(child) && child.type === SelectContent
                      )}
                    </FloatingList>
                  </div>
                </div>
              </div>
            </div>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </SelectContext.Provider>
  );
}

const selectTriggerVariants = cva(
  'tw-flex tw-w-full tw-items-center tw-justify-between tw-rounded-md tw-px-3 tw-py-2 tw-text-sm placeholder:tw-text-muted-foreground disabled:tw-cursor-not-allowed disabled:tw-opacity-50 [&>span]:!tw-truncate tw-transition-all tw-duration-150 tw-outline-none',
  {
    variants: {
      variant: {
        default:
          'tw-h-10 tw-border tw-border-input tw-bg-background focus:tw-outline-none',
        ghost:
          'tw-text-muted-foreground hover:tw-text-accent-foreground hover:tw-bg-accent text-center',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export type SelectTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof selectTriggerVariants> & {
    className?: string;
    children: ReactNode;
  };

export const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, variant, ...props }, ref) => {
    const { setIsOpen } = useContext(SelectContext);
    return (
      <button
        ref={ref}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(selectTriggerVariants({ variant }), className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

type SelectValueProps = {
  children?: ReactNode;
  placeholder?: string;
};

export function SelectValue({ children, placeholder }: SelectValueProps) {
  const { selectedValue } = useContext(SelectContext);
  return (
    <span className="tw-truncate">
      {children || selectedValue || placeholder || 'Select'}
    </span>
  );
}

type SelectContentProps = {
  children: ReactNode;
  className?: string;
};

export function SelectContent({ children, className }: SelectContentProps) {
  return (
    <div role="listbox" className={cn('tw-p-1 !tw-z-[999]', className)}>
      {children}
    </div>
  );
}

export function SelectGroup({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

export function SelectLabel({ children }: { children: ReactNode }) {
  return (
    <div className="tw-py-1.5 tw-pl-2 tw-pr-2 tw-text-sm tw-font-semibold">
      {children}
    </div>
  );
}

type SelectItemProps = HTMLAttributes<HTMLDivElement> & {
  value: string;
  children: ReactNode;
  className?: string;
};

export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ value, children, className }, forwardedRef) => {
    const {
      activeIndex,
      selectedIndex,
      getItemProps,
      handleSelect,
      registerOption,
    } = useContext(SelectContext);
    const { ref, index } = useListItem({ label: value });
    const isActive = activeIndex === index;
    const isSelected = selectedIndex === index;
    const combinedRef = useMergeRefs([ref, forwardedRef]);

    useEffect(() => {
      registerOption(value);
    }, [registerOption, value]);

    return (
      <div
        ref={combinedRef}
        role="option"
        aria-selected={isSelected}
        tabIndex={isActive ? 0 : -1}
        {...getItemProps({
          onClick: () => handleSelect(index, value),
          onKeyDown: (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              handleSelect(index, value);
            }
          },
        })}
        className={cn(
          'tw-relative tw-flex tw-w-full tw-cursor-pointer tw-select-none tw-items-center tw-rounded-sm tw-py-1.5 tw-px-2 tw-text-sm tw-outline-none',
          isActive && 'tw-bg-accent tw-text-accent-foreground',
          isSelected && 'tw-text-accent-foreground',
          className
        )}
      >
        {children}
      </div>
    );
  }
);
