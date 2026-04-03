describe('import vue components', () => {
    test('normal imports as expected', async ({ annotate }) => {
        await annotate('Vue imports: verifies standard static import of a .vue component resolves successfully');
        const cmp = await import('../src/components/HelloWorld.vue');
        expect(cmp).toBeDefined();
    });

    test('template string imports as expected', async ({ annotate }) => {
        await annotate('Vue imports: verifies template literal import of a .vue component resolves successfully');
        // eslint-disable-next-line @typescript-eslint/quotes
        const cmp = await import(`../src/components/HelloWorld.vue`);
        expect(cmp).toBeDefined();
    });

    test('dynamic imports as expected', async ({ annotate }) => {
        await annotate('Vue imports: verifies dynamic import with variable interpolation resolves the correct .vue component');
        const name = 'HelloWorld';
        const cmp = await import(`../src/components/${name}.vue`);
        expect(cmp).toBeDefined();
    });
});
