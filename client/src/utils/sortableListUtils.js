import { arrayMove } from '@dnd-kit/sortable';

function findContainer(id, state) {
    // id is present in formState; therefore, the id refers to a container, so we just return it
    if (id in state) {
        return id;
    }

    // 1. break formState into a series of keys
    const stateKeys = Object.keys(state);

    // 2. check each key to see if it is an array
    const arrayKeys = stateKeys.filter(el =>
        Array.isArray(state[el])
    );

    // 3. check if that array contains an object with id "id"
    const targetContainer = arrayKeys.find(key => {
        // locate this property in form state
        const arr = state[key];
        // run a recursive .find() on it to locate an object with the correct id
        return arr.find(el => el._id === id);
    });

    return targetContainer;
}

export function handleDragStart(event, setActive) {
    const { active } = event;
    const { id } = active;

    setActive(id);
};

export function handleDragOver(event, state, setState) {
    const { active, over } = event;
    const { id: activeId } = active;
    const { id: overId } = over;

    // find what containers are involved
    const activeContainer = findContainer(activeId, state);
    const overContainer = findContainer(overId, state);

    // error handling
    if (!activeContainer || !overContainer) {
        return;
    }

    setState(prev => {
        const activeItems = prev[activeContainer];
        const overItems = prev[overContainer];

        // find indexes of the item being dragged and what its being dragged over
        const activeIndex = activeItems.findIndex(
            el => el._id === activeId
        );
        const overIndex = overItems.findIndex(el => el._id === overId);

        // if the object isn't moving containers, just move items around
        if (activeContainer === overContainer) {
            // should make this only run if the indices are different
            return {
                ...prev,
                [activeContainer]: arrayMove(
                    prev[activeContainer],
                    activeIndex,
                    overIndex
                )
            };
        }

        // item is moving containers, time to calculate where it should go

        let newIndex;

        if (overId in prev) {
            newIndex = overItems.length + 1;
        } else {
            // should we put this item at the bottom of the list?
            const isBelowLastItem =
                over && overIndex === overItems.length - 1;

            const modifier = isBelowLastItem ? 1 : 0;

            // if the item being hovered over has an index in overItems (therefore, is another draggable)
            newIndex =
                overIndex >= 0
                    ? overIndex + modifier
                    : overItems.length + 1;
        }

        return {
            ...prev,
            [activeContainer]: [
                ...prev[activeContainer].filter(
                    item => item._id !== activeId
                )
                // activeContainer now contains everything it did before minus the active item
            ],
            [overContainer]: [
                ...prev[overContainer].slice(0, newIndex),
                state[activeContainer][activeIndex],
                ...prev[overContainer].slice(
                    newIndex,
                    prev[overContainer].length
                )
                // overContainer now contains everything it did before with the active item spliced in
            ]
        };
    });

};

export function handleDragEnd(event, state, setState, setActive) {
    const { active, over } = event;
    const { id: activeId } = active;
    const { id: overId } = over;

    const activeContainer = findContainer(activeId, state);
    const overContainer = findContainer(overId, state);

    // error handling
    // note that handleDragOver continually updates the ids, so at the end of a drag, activeContainer and overContainer *should* be the same
    if (
        !activeContainer ||
        !overContainer ||
        activeContainer !== overContainer
    ) {
        return;
    }

    const activeIndex = state[activeContainer].findIndex(
        el => el._id === activeId
    );
    const overIndex = state[overContainer].findIndex(
        el => el._id === overId
    );

    if (activeIndex !== overIndex) {
        setState(items => {
            return {
                ...items,
                [overContainer]: arrayMove(
                    items[overContainer],
                    activeIndex,
                    overIndex
                )
            };
        });
    }

    setActive(null);
}