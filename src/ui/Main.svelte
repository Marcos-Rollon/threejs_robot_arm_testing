<script>
    import 'bootstrap/dist/css/bootstrap.min.css';
    import { Button, Form, FormGroup, FormText, Input, Label } from 'sveltestrap';

    export let onChanged = null;

    let baseObjetive = 0;
    let midObjetive = 0;
    let upObjetive = 0;


    function onInput(){
        if(onChanged){
            onChanged(baseObjetive, midObjetive, upObjetive);
        }
    }
    function onResetButtonTap(){
        if(onChanged){
            baseObjetive = 0;
            midObjetive = 0;
            upObjetive = 0;
            onChanged(0,0,0);
        }
    }
</script>

<main>
    <Form>
        <FormGroup>
            <Label for="base-range"> {`Base : ${baseObjetive} deg`}</Label>
            <Input
                type="range"
                name ="base-range"
                id ="base-range"
                min={-180}
                max={180}
                step={1}
                placeholder= "base range"
                bind:value = {baseObjetive}
                on:input = {onInput}
            ></Input>
            <Label for="mid-range"> {`Mid : ${midObjetive} deg`}</Label>
            <Input
                type="range"
                name ="mid-range"
                id ="mid-range"
                min={-80}
                max={80}
                step={1}
                placeholder= "mid range"
                bind:value = {midObjetive}
                on:input = {onInput}
            ></Input>
            <Label for="up-range"> {`Up : ${upObjetive} deg`}</Label>
            <Input
                type="range"
                name ="up-range"
                id ="up-range"
                min={-180}
                max={180}
                step={1}
                placeholder= "up range"
                bind:value = {upObjetive}
                on:input = {onInput}
            ></Input>
            <Button type="button" on:click={onResetButtonTap}>Click</Button>
        </FormGroup>
    </Form>
</main>
<style>
    main{
        position: absolute;
        color:white;
        width: 30vw;
    }
</style>