package com.codeprojectz.main.controllers;

import com.codeprojectz.main.dtos.ArtigoRecordDto;
import com.codeprojectz.main.models.Artigo;
import com.codeprojectz.main.repositories.ArtigoRepository;
import com.codeprojectz.main.repositories.CategoriaRepository;
import com.codeprojectz.main.repositories.ConteudoRepository;
import com.codeprojectz.main.repositories.UsuarioRepository;

import jakarta.validation.Valid;

import java.util.Date;
import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/artigo")
@RestController
public class ArtigoController {

    @Autowired
    ArtigoRepository artigoRepository;
    @Autowired
    CategoriaRepository categoriaRepository;
    @Autowired
    ConteudoRepository conteudoRepository;
    @Autowired
    UsuarioRepository usuarioRepository;

    @PostMapping
    public ResponseEntity<Artigo> addArtigo(@RequestBody @Valid ArtigoRecordDto artigoRecordDto) {
        var artigo = new Artigo();
        BeanUtils.copyProperties(artigoRecordDto, artigo);

        artigo.setDataPostagem(new Date());
        artigo.setCategoria(categoriaRepository.findByNome(artigoRecordDto.categoriaNome()));
        artigo.setCriador(usuarioRepository.buscarPorEmail(artigoRecordDto.criadorEmail()));

        List<Integer> ids = conteudoRepository.findLastTwoIds();
        artigo.setImagem(conteudoRepository.findByConteudoID(ids.getLast()));
        artigo.setConteudo(conteudoRepository.findByConteudoID(ids.getFirst()));
        
        return ResponseEntity.status(HttpStatus.CREATED).body(artigoRepository.save(artigo));
    }

    @GetMapping
    public ResponseEntity<List<Artigo>> listAll(){
        List<Artigo> lista = artigoRepository.findAll();

        if (lista.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        return ResponseEntity.status(HttpStatus.OK).body(lista);
    }

    @GetMapping("/id/{artigoID}")
    public ResponseEntity<Artigo> getArtigoById(@PathVariable(value = "artigoID") int artigoID){
        Artigo artigo = artigoRepository.findById(artigoID);

        if(artigo == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        return ResponseEntity.status(HttpStatus.OK).body(artigo);
    }

    @GetMapping("/categoria/{categoriaID}")
    public ResponseEntity<List<Artigo>> findByCategoria(@PathVariable(value = "categoriaID") int categoriaID){
        List<Artigo> lista = artigoRepository.findByCategoriaCategoriaID(categoriaID);
        if (lista.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        return ResponseEntity.status(HttpStatus.OK).body(lista);
    }

    @GetMapping("/{nome}")
    public ResponseEntity<List<Artigo>> findByNome(@PathVariable(value = "nome") String nome){
        List<Artigo> lista = artigoRepository.findByCategoriaNomeLike(nome);
        if (lista.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        return ResponseEntity.status(HttpStatus.OK).body(lista);
    }

    @GetMapping("/lastFive")
    public ResponseEntity<List<Artigo>> findLastFive(){
        List<Artigo> lista = artigoRepository.findTop5ByOrderByDataPostagemDesc(PageRequest.of(0, 5));
        if (lista.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        return ResponseEntity.status(HttpStatus.OK).body(lista);
    }

    @GetMapping("/lastFive/{id}")
    public ResponseEntity<List<Artigo>> findLastFiveByCategoria(@PathVariable(value = "id") Integer id){
        List<Artigo> lista = artigoRepository.findTop5ByCategoriaCategoriaIDOrderByDataPostagemDesc(id, PageRequest.of(0, 5));
        if (lista.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        return ResponseEntity.status(HttpStatus.OK).body(lista);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteArtigo(@PathVariable(value="id") Integer id){
        Artigo artigo = artigoRepository.findById(id).get();
        if (artigo == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        artigoRepository.delete(artigo);
        conteudoRepository.delete(conteudoRepository.findByConteudoID(artigo.getImagem().getConteudoID()));
        conteudoRepository.delete(conteudoRepository.findByConteudoID(artigo.getConteudo().getConteudoID()));
        return ResponseEntity.status(HttpStatus.OK).body("Artigo excluido com sucesso!");
    }

    @GetMapping("/search/{text}")
    public ResponseEntity<List<Artigo>> searchArtigo(@PathVariable(value="text") String text){
        List<Artigo> lista = artigoRepository.findByTituloContainingIgnoreCaseOrDescricaoContainingIgnoreCaseOrCategoriaNomeContainingIgnoreCase(text, text, text);
        if (lista.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.status(HttpStatus.OK).body(lista);
    }

    @GetMapping("/creator/{email}")
    public ResponseEntity<List<Artigo>> getByCriadorEmail(@PathVariable(value="email") String email){
        List<Artigo> lista = artigoRepository.findByCriadorEmail(email);
        if (lista.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.status(HttpStatus.OK).body(lista);
    }
}
