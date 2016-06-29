import State from 'src/State';

describe('StateSpec', () => {
    it('add has remove', () => {
        const state = new State();
        state.addState('readonly');
        expect(state.hasState('readonly')).toBe(true);
        state.removeState('readonly');
        expect(state.hasState('readonly')).toBe(false);
        state.destroy();
    });

    it('add twice', () => {
        const state = new State();
        state.addState('readonly');
        state.addState('readonly');
        expect(state.hasState('readonly')).toBe(true);
        state.destroy();
    });
});
