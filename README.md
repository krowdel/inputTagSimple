Installation:

In the head section:
<link href="style_tags.css" rel="stylesheet" type="text/css">
<script src="scripTags.js"></script>

Code in html:
<input type=text name="text" value="value1, value2, ..."> 
// the value is optional, separated by a comma by default

<script>
    const config = { inputName: "text" };
    const tags = new Tags(config);
</scirpt>

Default configuration: 
 
 config = {
            inputName: "email", // name of the input we want to replace
            separate: ', ',     // data separator to send
            type: "default",    // validation type (mail, text)
            limit: 512          // total string length limit O or null no limit
        };
  lang = 'pl'; // language version (pl, en, de, ru, hu)
  tagas = new Tags(config, lang)
